import { Request, Response } from 'express';

const dataDefinition: { [key: string]: number } = {
    "bvn": 11,
    "phone": 11
};


export const validateDataPoint = async (req: Request, res: Response) => {

    let dataPoint = req.params.dataPoint;

    let dataValue = req.params.dataValue;

    if (!dataPoint || !dataValue) {
        return res.status(400).json({ success: false, rstatus: 0, message: 'Missing dataPoint or dataValue in parameters.' });
    }

    if (dataDefinition.hasOwnProperty(dataPoint)) {
        const expectedLength = dataDefinition[dataPoint]; // No error here
        if (dataValue.length === expectedLength) {
            return res.status(200).json({ success: true, rstatus: 1, message: `Data value for '${dataPoint}' is valid.` });
        } else {
            return res.status(400).json({
                success: false,
                rstatus: 0,
                message: `Data value for '${dataPoint}' should be ${expectedLength} characters long, but got ${dataValue.length}.`
            });
        }
    } else {
        return res.status(404).json({ success: false, rstatus: 0, message: `Data point '${dataPoint}' is not defined.` });
    }

    


}