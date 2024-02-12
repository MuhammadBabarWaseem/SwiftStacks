import express from "express";
import { S3 } from "aws-sdk";

const app = express();
const port = 3001;

const s3 = new S3({
    accessKeyId: "3e0a5be5a60cd6321542a72d4f0697bd",
    secretAccessKey:
        "1e5c3b9613f1f6617e26f2712658f00667a6cbf3b5147f96762f2c5af91babf1",
    endpoint: "https://5c79fff7be948c93bac0e82f57f8f003.r2.cloudflarestorage.com",
});

app.get("/*", async (req, res) => {

    const host = req.hostname;
    console.log({host})
    const id = host.split(".")[0];
    const filePath = req.path;
    console.log({filePath})

    const contents = await s3
        .getObject({
            Bucket: "babar-vercel-bucket",
            Key: `dist/${id}${filePath}`,
        })
        .promise();

    const type = filePath.endsWith("html")
        ? "text/html"
        : filePath.endsWith("css")
            ? "text/css"
            : "application/javascript";

    res.set("Content-Type", type);
    res.send(contents.Body)
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
