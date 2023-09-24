import axios, {  } from "axios";
import { uploadFiles } from "../main/allianz_func";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import * as FormData from 'form-data';
import { FileUploadDto } from "../types/appTypes";

// const AllianzBURL = process.env.ALLIANZ_BASE_URL;

export async function downloadAndUploadImage() {
    const imageUrl: string = 'https://manybot-files.s3.eu-central-1.amazonaws.com/113824337965349/wa/2023/09/17/original_f83c6e9b937a28fd75e90ee884629e75.jpeg';

    // Create a new FormData object
    const formData = new FormData();

    try {
        // Use Axios to download the image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Add the image to the FormData object directly as a buffer
        formData.append('file', Buffer.from(response.data), 'downloaded_image.jpeg');

        // Now you can send the FormData in a POST request using Axios
        const uploadResponse = await axios.post('http://localhost:3500/api/merchants/upload', formData, {
            headers: {
                ...formData.getHeaders(),
            },
            // other POST data if needed
        });

        console.log('Image uploaded successfully:', uploadResponse.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function uploadImageToAllianz(params: FileUploadDto) {

    // Create a new FormData object
    const formData = new FormData();

    try {
        // Use Axios to download the image
        const response = await axios.get(params.imageUrl, { responseType: 'arraybuffer' });

        // Add the image to the FormData object directly as a buffer
        formData.append('file', Buffer.from(response.data), 'downloaded_image.jpeg');

        // Now you can send the FormData in a POST request using Axios
        // const uploadResponse = await axios.post(`${AllianzBURL}/MotorComprehensive/UploadFiles?ReferenceId=${params.refId}&DocumentName=${params.docType}`, formData, {
        //     headers: {
        //         ...formData.getHeaders(),
        //     },
        //     // other POST data if needed
        // });

        const uploadResponse = await uploadFiles(params.refId, params.docType, formData);

        console.log('Image uploaded successfully:', uploadResponse);

        return uploadResponse;
    } catch (error) {
        console.error('AWS Upload Error:', error);

        return null;
    }
}