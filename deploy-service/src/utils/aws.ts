import { S3 } from "aws-sdk";
import path from "path";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "3e0a5be5a60cd6321542a72d4f0697bd",
    secretAccessKey:
        "1e5c3b9613f1f6617e26f2712658f00667a6cbf3b5147f96762f2c5af91babf1",
    endpoint: "https://5c79fff7be948c93bac0e82f57f8f003.r2.cloudflarestorage.com",
});

export async function downloadS3Folder(prefix: string) {
    console.log("prefix", prefix);
    const allFiles = await s3
        .listObjectsV2({
            Bucket: "babar-vercel-bucket",
            Prefix: prefix,
        })
        .promise();

    const allPromises =
        allFiles.Contents?.map(async ({ Key }) => {
            return new Promise(async (resolve) => {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path.join(__dirname, "../", Key);
                const outputFile = fs.createWriteStream(finalOutputPath);
                const dirName = path.dirname(finalOutputPath);
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
                }
                s3.getObject({
                    Bucket: "babar-vercel-bucket",
                    Key,
                })
                    .createReadStream()
                    .pipe(outputFile)
                    .on("finish", () => {
                        resolve("");
                    });
            });
        }) || [];
    console.log("awaiting");

    await Promise.all(allPromises?.filter((x) => x !== undefined));
}


export async function copyFinalDist(id: string) { 
    
    const folderPath = path.join(__dirname, '..' ,`output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach((file) => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file)
    })

}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3
        .upload({
            Body: fileContent,
            Bucket: "babar-vercel-bucket",
            Key: fileName.replace(/\\/g, "/"),
        })
        .promise();
    console.log(response);
};

const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach((file) => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    });

    return response;
};

