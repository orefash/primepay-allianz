
import { Request, Response } from 'express';
import * as allianzFunc from '../main/allianz_func';
import * as allianzHelper from "../main/allianz_helper";
import { PurchaseComprehensiveDto, PurchaseDto } from '../dto/allianz.dto';
import { validateComprehensivePurchaseDto, validatePurchaseDto } from '../helper/validatePurchase';
// import * as queueHelper from "../queue_handler/queue";

import { uploadDocsRun } from "../queue_handler/uploadFilesQueue";
import { purchaseRun } from "../queue_handler/thirdPartyPurchaseQueue";
import { purchaseComprehensiveRun } from "../queue_handler/comprehensivePurchaseQueue";
import { GeneratePolicyCertificateDto, MultipleFileUploadDto, ValidateQuoteDto, requestQuoteDto } from '../types/appTypes';
import { validateFilesUploadDto, validateMotorQuoteBody, validatePolicyCertificateDto, validateQuoteChoice } from '../helper/dtoValidator';
import { logger } from "../logger/index";
// fileUploadController.js


export const uploadMultipleDocs = async (req: Request, res: Response) => {
    const contactId = req.params.contactId;

    try {
        const pData: MultipleFileUploadDto | null = validateFilesUploadDto({ ...req.body, contactId });

        if (!pData) {
            return res.status(400).json({ success: false, message: "Invalid input data" }); // More informative message
        }

        // await triggerUploadImages(pData);

        await uploadDocsRun(pData, contactId);

        return res.status(200).json({ success: true, message: "Files uploaded successfully" }); // Success message

    } catch (error) {
        console.error("Error uploading files:", error); // Log the error for debugging

        if (error instanceof Error && error.name === 'CustomError') { // Check if it's a custom error
            return res.status(500).json({ success: false, message: error.message });
        }
        if (error instanceof Error && error.name === 'ValidationError') { // Check if it's a validation error
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(500).json({ success: false, message: "An error occurred during file upload." }); // Generic error message
    }
};




export async function getMotorSizes(req: Request, res: Response) {
    try {
        // Call the relevant function to retrieve motor sizes from allianzFunc or wherever it's implemented
        const motorSizes = await allianzFunc.getMotorSizes();

        // Respond with the retrieved data
        res.status(200).json({
            data: motorSizes,
        });
    } catch (error) {
        // Handle any errors and respond with an error message
        console.error('Error fetching motor sizes:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}


export async function validateMotor(req: Request, res: Response) {
    try {
        const { regNo } = req.body;
        const data = await allianzFunc.validateMotor(regNo);

        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            // error: error,
        });
    }
}



export async function getMotorPremiumBySize(
    req: Request,
    res: Response
) {
    try {
        const size = req.params.size;

        // Your existing logic to fetch data based on the size parameter
        const data = await allianzFunc.getAmountByMotorSizes(size);

        res.status(200).json(data);
    } catch (error) {
        // Log the error
        console.error("Error in getMotorPremiumBySize:", error);

        // Handle the error gracefully
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}


export async function purchaseThirdParty(req: Request, res: Response) {
    try {
        const pData: PurchaseDto | null = validatePurchaseDto(req.body);
        const contactId = req.params.contactId;

        if (!pData) {
            console.log("Invalid 3rd purchase dto: ", pData)
            return res.status(400).json({ success: false, fstatus: 4 });
        }

        logger.info("in ptp");
        console.log("Valid purchase dto: ", pData)

        let runResult = await purchaseRun(pData, contactId);


        // await triggerTPP(pData, contactId);
        return res.status(200).json({ success: true, ...runResult });
    } catch (error) {
        console.error('Error in purchaseThirdParty:', error);
        return res.status(500).json({ success: false, error: 'Internal server error', fstatus: 4 });
    }
}

export async function purchaseComprehensive(req: Request, res: Response) {
    try {
        const pData: PurchaseComprehensiveDto | null = validateComprehensivePurchaseDto(req.body);
        const contactId = req.params.contactId;

        console.log("pol: ", contactId)

        if (!pData) {
            console.log("Invalid comp purchase dto: ", pData);
            return res.status(400).json({ success: false, fstatus: 4 });
        }

        console.log("Valid comp purchase dto: ", pData);

        let runResult = await purchaseComprehensiveRun(pData, contactId);

        return res.status(200).json({ success: true, ...runResult });
    } catch (error) {
        console.error('Error in purchaseComprehensive:', error);
        return res.status(500).json({ success: false, error: 'Internal server error', fstatus: 4 });
    }
}

export async function getComprehensiveQuote(req: Request, res: Response) {
    try {
        const pData: requestQuoteDto | null = validateMotorQuoteBody(req.body);

        if (!pData) {
            return res.status(400).json({ success: false });
        }

        const data = await allianzFunc.getComprehensiveQuote(pData);

        const { isValid, ...responseData } = data;
        return res.status(200).json({ rstatus: data.isValid ? 1 : 0, success: data.isValid, ...responseData });
    } catch (error) {
        console.error('Error in getComprehensiveQuote:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export async function validateQuote(req: Request, res: Response) {
    try {
        const pData: ValidateQuoteDto | null = validateQuoteChoice(req.body);

        if (!pData) {
            return res.status(400).json({ success: false, rstatus: 0 });
        }

        const data = await allianzHelper.validateQuoteChoice(pData);
        return res.status(200).json({ success: data.success, rstatus: data.success ? 1 : 0, ...data });
    } catch (error) {
        console.error('Error in validateQuote:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}



export async function generatePolicyCertificate(req: Request, res: Response) {
    try {
        const pData: GeneratePolicyCertificateDto | null = validatePolicyCertificateDto(req.body);

        if (!pData) {
            return res.status(400).json({ success: false, rstatus: 0 });
        }

        const data = await allianzFunc.generatePolicyCertificate(pData);
        return res.status(200).json({ success: data.success, rstatus: data.success ? 1 : 0, ...data });
    } catch (error) {
        logger.error('Error in generate policy certificate:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}