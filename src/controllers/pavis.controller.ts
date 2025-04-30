import { Request, Response } from 'express';
import { generateApplicationReference } from '../helper/utils';
import { CompleteApplication, InitApplication, isValidInitApplication } from '../dto/pavis.dto';




export const saveApplication = async (req: Request, res: Response) => {

    try {

        console.log("Appln Data pre validation: ", req.body);
        if (!isValidInitApplication(req.body)) {
            return res.status(400).json({ success: false, message: 'Invalid request body format for InitApplication.', fstatus: 0 });
        }

        const applicationData = req.body as InitApplication;

        // console.log("Appln Data: ", applicationData);

        let appln_id = await generateApplicationReference()

        let finalData: CompleteApplication = { ...applicationData, appln_id }

        console.log("Full Data: ", finalData);

        return res.status(200).json({ success: true, data: finalData, message: 'Data saved successfully', fstatus: 1 });

    } catch (error: any) {
        return res.status(400).json({ success: false, message: 'Error in InitApplication. ' + error.message, fstatus: 0 });

    }

}