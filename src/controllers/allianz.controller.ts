
import { Request, Response } from 'express';
import * as allianzFunc from '../main/allianz_func';
import * as allianzHelper from "../main/allianz_helper";
import { PurchaseComprehensiveDto, PurchaseDto } from '../dto/purchase3rdParty.dto';
import { validateComprehensivePurchaseDto, validatePurchaseDto } from '../helper/validatePurchase';
// import * as queueHelper from "../queue_handler/queue";

import { triggerUploadImages } from "../queue_handler/uploadFilesQueue";
import { triggerTPP, } from "../queue_handler/thirdPartyPurchaseQueue";
import { triggerCPQ } from "../queue_handler/comprehensivePurchaseQueue";
import { ValidateQuoteDto, requestQuoteDto } from '../types/appTypes';
import { validateFilesUploadDto, validateMotorQuoteBody, validateQuoteChoice } from '../helper/dtoValidator';

// fileUploadController.js


export const uploadMultipleDocs = async (req: Request, res: Response) => {
    const contactId = req.params.contactId;

    const pData = validateFilesUploadDto({ ...req.body, contactId });

    if (!pData) {
        return res.status(400).json({ success: false });
    }

    await triggerUploadImages(pData);

    return res.status(200).json({ success: true });
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
            return res.status(400).json({ success: false });
        }

        await triggerTPP(pData, contactId);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error in purchaseThirdParty:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export async function purchaseComprehensive(req: Request, res: Response) {
    try {
        const pData: PurchaseComprehensiveDto | null = validateComprehensivePurchaseDto(req.body);
        const contactId = req.params.contactId;

        if (!pData) {
            return res.status(400).json({ success: false });
        }

        await triggerCPQ(pData, contactId);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error in purchaseComprehensive:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
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
