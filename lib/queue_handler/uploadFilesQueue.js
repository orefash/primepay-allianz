"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerUploadImages = void 0;
const Queue = require("bull");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const redisConnection_1 = require("./redisConnection");
const awsS3Helper_1 = require("../helper/awsS3Helper");
const manychatHelper_1 = require("../helper/manychatHelper");
const uploadAllianzDocsQueue = new Queue("upload_multiple_allianz", redisConnection_1.default);
uploadAllianzDocsQueue.process(async (job) => {
    let params = job.data;
    let contactId = job.data.contactId;
    console.log("In Upload Multiple Allianz");
    await (0, awsS3Helper_1.uploadImageToAllianz)({ refId: params.refId, imageUrl: params.selfie, docType: "Selfie" });
    await (0, awsS3Helper_1.uploadImageToAllianz)({ refId: params.refId, imageUrl: params.rear_view, docType: "Rear View" });
    await (0, awsS3Helper_1.uploadImageToAllianz)({ refId: params.refId, imageUrl: params.front_view, docType: "Front view (incl. plate number)" });
    await (0, awsS3Helper_1.uploadImageToAllianz)({ refId: params.refId, imageUrl: params.vehicle_license, docType: "Vehicle License Document" });
    await (0, awsS3Helper_1.uploadImageToAllianz)({ refId: params.refId, imageUrl: params.valid_id, docType: "ID/Passport/Driver License" });
    await (0, awsS3Helper_1.uploadImageToAllianz)({ refId: params.refId, imageUrl: params.left_view, docType: "Left Side View" });
    await (0, awsS3Helper_1.uploadImageToAllianz)({ refId: params.refId, imageUrl: params.right_view, docType: "Right Side View" });
    const lastUpload = await (0, awsS3Helper_1.uploadImageToAllianz)({ refId: params.refId, imageUrl: params.chassis_view, docType: "Chassis View" });
    if (lastUpload.isValid) {
        console.log("Multiple Uploads done");
        await (0, manychatHelper_1.sendFlow)(contactId, "upload_confirm");
    }
});
async function triggerUploadImages(params) {
    if (params) {
        uploadAllianzDocsQueue.add(params);
    }
}
exports.triggerUploadImages = triggerUploadImages;
//# sourceMappingURL=uploadFilesQueue.js.map