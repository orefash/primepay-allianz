
import * as Queue from "bull";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import opts from "./redisConnection";
import { uploadImageToAllianz } from "../helper/awsS3Helper";
import { sendFlow } from "../helper/manychatHelper";
import { MultipleFileUploadDto } from "../types/appTypes";

const uploadAllianzDocsQueue = new Queue("upload_multiple_allianz", opts);

export async function uploadDocsRun(params: MultipleFileUploadDto, contactId: string)  {

    console.log("In Upload Multiple Allianz");
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.selfie, docType: "Selfie"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.rear_view, docType: "Rear View"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.front_view, docType: "Front view (incl. plate number)"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.vehicle_license, docType: "Vehicle License Document"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.valid_id, docType: "ID/Passport/Driver License"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.left_view, docType: "Left Side View"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.right_view, docType: "Right Side View"});
    const lastUpload = await uploadImageToAllianz({ refId: params.refId, imageUrl: params.chassis_view, docType: "Chassis View"});

    if(lastUpload.isValid){
        console.log("Multiple Uploads done");
        await sendFlow(contactId, "upload_confirm");
    }else{
        throw new Error("Multiple Uploads process failed")
    }

}


uploadAllianzDocsQueue.process(async (job) => {

    let params: MultipleFileUploadDto = job.data;
    let contactId: string = job.data.contactId;

    console.log("In Upload Multiple Allianz");
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.selfie, docType: "Selfie"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.rear_view, docType: "Rear View"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.front_view, docType: "Front view (incl. plate number)"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.vehicle_license, docType: "Vehicle License Document"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.valid_id, docType: "ID/Passport/Driver License"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.left_view, docType: "Left Side View"});
    await uploadImageToAllianz({ refId: params.refId, imageUrl: params.right_view, docType: "Right Side View"});
    const lastUpload = await uploadImageToAllianz({ refId: params.refId, imageUrl: params.chassis_view, docType: "Chassis View"});

    if(lastUpload.isValid){
        console.log("Multiple Uploads done");
        await sendFlow(contactId, "upload_confirm");
    }

});

export async function triggerUploadImages(params: MultipleFileUploadDto | null) {
    if(params){
        uploadAllianzDocsQueue.add(params);

    }
}