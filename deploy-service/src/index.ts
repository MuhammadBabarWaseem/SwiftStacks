import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./utils/aws";
import { buildProject } from "./utils";

// in this we push from redis get from here, vice-versa in previous
// 1) open ubunty 2) LPUSH build-queue 006
const subscriber = createClient();
subscriber.connect();

async function main() {
    while (1) {
        // pop from right
        const response = await subscriber.brPop(
            commandOptions({ isolated: true }),
            "build-queue",
            0
        );

        // @ts-ignore
        const id = response?.element;
            await downloadS3Folder(`output/${id}`);
            await buildProject(id!);
            console.log("Downloaded!");
            await copyFinalDist(id!)
    }
}

main();
