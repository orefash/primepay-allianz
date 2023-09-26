"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerUploadImage = void 0;
const Queue = require("bull");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const redisConnection_1 = require("./redisConnection");
const awsS3Helper_1 = require("../helper/awsS3Helper");
const uploadAllianzDocQueue = new Queue("upload_allianz", redisConnection_1.default);
uploadAllianzDocQueue.process(async (job) => {
    let params = job.data;
    console.log("In Upload Allianz");
    let pData = await (0, awsS3Helper_1.uploadImageToAllianz)(params);
    console.log("Res: ", pData);
});
async function triggerUploadImage(params) {
    if (params) {
        uploadAllianzDocQueue.add(params);
    }
}
exports.triggerUploadImage = triggerUploadImage;
//# sourceMappingURL=uploadFileQueue.js.map