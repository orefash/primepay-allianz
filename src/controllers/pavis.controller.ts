import { Request, Response } from 'express';
// import { generateApplicationReference } from '../helper/utils';
import { CompleteApplication, InitApplication, isValidInitApplication } from '../dto/pavis.dto';
import { generateUniqueApplicationReference, saveInitApplicationData } from '../db/application';


export const saveApplication = async (req: Request, res: Response) => {

    try {

        console.log("Appln Data pre-validation: ", req.body);
        if (!isValidInitApplication(req.body)) {
            return res.status(400).json({ success: false, message: 'Invalid request body format for InitApplication.', fstatus: 0 });
        }

        const applicationData = req.body as InitApplication;
        

        let appln_id = await generateUniqueApplicationReference();

        let finalData: CompleteApplication = { ...applicationData, appln_id };

        finalData.stage = 1;
        finalData.hasPaid = false;

        console.log("Full Data: ", finalData);

        let isSaved: boolean = await saveInitApplicationData(finalData);

        return res.status(200).json({ success: true, data: finalData, message: 'Data saved successfully', fstatus: 1, saved: isSaved });

    } catch (error: any) {
        return res.status(400).json({ success: false, message: 'Error in InitApplication. ' + error.message, fstatus: 0 });

    }

}