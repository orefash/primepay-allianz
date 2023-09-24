
import * as Queue from "bull";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import opts from "./redisConnection";
import { uploadImageToAllianz } from "../helper/awsS3Helper";
import { FileUploadDto } from "../types/appTypes";

const uploadAllianzDocQueue = new Queue("upload_allianz", opts);

uploadAllianzDocQueue.process(async (job) => {

    let params: FileUploadDto = job.data;
    console.log("In Upload Allianz");
    let pData = await uploadImageToAllianz(params);

    console.log("Res: ", pData);

});

export async function triggerUploadImage(params: FileUploadDto | null) {
    if(params){
        uploadAllianzDocQueue.add(params);

    }
}