"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToAllianz = exports.downloadAndUploadImage = void 0;
const axios_1 = require("axios");
const allianz_func_1 = require("../main/allianz_func");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const FormData = require("form-data");
// const AllianzBURL = process.env.ALLIANZ_BASE_URL;
async function downloadAndUploadImage() {
    const imageUrl = 'https://manybot-files.s3.eu-central-1.amazonaws.com/113824337965349/wa/2023/09/17/original_f83c6e9b937a28fd75e90ee884629e75.jpeg';
    // Create a new FormData object
    const formData = new FormData();
    try {
        // Use Axios to download the image
        const response = await axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
        // Add the image to the FormData object directly as a buffer
        formData.append('file', Buffer.from(response.data), 'downloaded_image.jpeg');
        // Now you can send the FormData in a POST request using Axios
        const uploadResponse = await axios_1.default.post('http://localhost:3500/api/merchants/upload', formData, {
            headers: Object.assign({}, formData.getHeaders()),
            // other POST data if needed
        });
        console.log('Image uploaded successfully:', uploadResponse.data);
    }
    catch (error) {
        console.error('Error:', error);
    }
}
exports.downloadAndUploadImage = downloadAndUploadImage;
async function uploadImageToAllianz(params) {
    // Create a new FormData object
    const formData = new FormData();
    try {
        // Use Axios to download the image
        const response = await axios_1.default.get(params.imageUrl, { responseType: 'arraybuffer' });
        // Add the image to the FormData object directly as a buffer
        formData.append('file', Buffer.from(response.data), 'downloaded_image.jpeg');
        // Now you can send the FormData in a POST request using Axios
        // const uploadResponse = await axios.post(`${AllianzBURL}/MotorComprehensive/UploadFiles?ReferenceId=${params.refId}&DocumentName=${params.docType}`, formData, {
        //     headers: {
        //         ...formData.getHeaders(),
        //     },
        //     // other POST data if needed
        // });
        const uploadResponse = await (0, allianz_func_1.uploadFiles)(params.refId, params.docType, formData);
        console.log('Image uploaded successfully:', uploadResponse);
        return uploadResponse;
    }
    catch (error) {
        console.error('AWS Upload Error:', error);
        return null;
    }
}
exports.uploadImageToAllianz = uploadImageToAllianz;
//# sourceMappingURL=awsS3Helper.js.map