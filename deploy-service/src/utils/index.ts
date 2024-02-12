import { exec } from "child_process";
import path from "path";
import fs from "fs";

export function buildProject(id: string) {
    const projectDirectory = path.resolve(__dirname, '..', '..', `dist/output/${id}`);
    console.log({projectDirectory})
    if (!fs.existsSync(projectDirectory)) {
        console.error(`Error: Project directory "${projectDirectory}" does not exist.`);
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const child = exec(
            `cd ${projectDirectory} && npm install && npm run build`
        );

        child.stdout?.on("data", function (data) {
            console.log("stdout: " + data);
        });
        child.stderr?.on("data", function (data) {
            console.log("stderr: " + data);
        });

        child.on("close", function (code) {
            resolve("");
        });
    });
}
