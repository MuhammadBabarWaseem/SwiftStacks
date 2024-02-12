import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { createClient } from "redis";
import path from "path";
import { generateId } from "./utils";
import { getAllFiles } from "./utils/file";
import { uploadFile } from "./utils/aws";

//------- FOR REDIS --------
// 1) open ubuntu 2) redis-cli 3) RPOP build-queue -> it will give the id of project, that we will get in thunder client

const app = express();
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  try {
    const repoUrl = req.body.repoUrl;
    const id = generateId();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    console.log({ files });

    files.forEach(async (file) => {
      await uploadFile(file.slice(__dirname.length + 1), file);
    });

    await new Promise((resolve) => setTimeout(resolve, 6000))
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    res.json({
      id: id,
      message: "Repository Cloned Successfully!",
    });
  } catch (error) {
    console.error("Error during deployment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/status', async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({ status: response }); 

})

app.listen(3000, () => {
  console.log("App Listening On Port: 3000");
});
