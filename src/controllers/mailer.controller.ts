// emailController.js

import { sendOTPEmail } from '../helper/emailHelper';
import { Request, Response } from 'express';

export const validateEmailController = async (req: Request, res: Response) => {
    try {
        const email = req.params.email;
        console.log("in email: ", email);

        if (!email) {
            res.status(400).json({
                success: false,
                rstatus: 0,
                message: 'Email parameter is missing',
            });
        }

        const data = await sendOTPEmail(email);

        console.log("Mailer Output: ", data);

        res.status(200).json({
            ...data,
            rstatus: data.success ? 1 : 0,
        });
    } catch (error) {
        console.error('Error in validateEmailController:', error);
        res.status(500).json({
            success: false,
            rstatus: 0,
            message: 'Internal server error',
        });
    }
};
