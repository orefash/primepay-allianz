
import { Request, Response } from 'express';
import { sendFlow } from '../helper/manychatHelper';


export const callbackManyChatController = async (req: Request, res: Response) => {
    console.log("in callback: ", req.params.txt);
    let contactId = req.params.txt;

    let data = await sendFlow(contactId, "pay_confirm");

    res.status(200).json({
        data: data,
        //   status: serverStatus(),
    });
};