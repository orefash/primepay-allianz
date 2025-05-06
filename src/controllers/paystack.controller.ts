import { createPaymentLink, verifyPayment } from "../main/paystack";
import { Request, Response } from 'express';

export const createPaymentLinkController = async (req: Request, res: Response) => {
    try {

        const tranId: string = req.params.tid;
        const data = await createPaymentLink(req.body, tranId);

        res.status(200).json({
            fstatus: data.success ? 1 : 0,
            ...data
        });
    } catch (error) {
        console.error('Error in createPaymentLinkController:', error);
        res.status(500).json({
            success: false,
            fstatus: 0,
            message: 'Internal server error',
        });
    }
};

export const verifyPaymentController = async (req: Request, res: Response) => {
    try {
        const reference = req.params.ref;
        const tid = req.params.tid;

        const data = await verifyPayment(reference, tid);

        res.status(200).json({
            fstatus: data.success ? 1 : 0,
            ...data
        });
    } catch (error) {
        console.error('Error in verifyPaymentController:', error);
        res.status(500).json({
            success: false,
            fstatus: 0,
            message: 'Internal server error',
        });
    }
};

