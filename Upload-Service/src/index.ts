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

    publisher.lPush("build-queue", id);

    res.json({
      id: id,
      message: "Repository Cloned Successfully!",
    });
  } catch (error) {
    console.error("Error during deployment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("App Listening On Port: 3000");
});
