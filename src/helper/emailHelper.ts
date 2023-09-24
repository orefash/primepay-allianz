import * as nodemailer from 'nodemailer';

import { generateOTP } from "./utils";


const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com', // Replace with your SMTP server hostname
    port: 465, // Replace with the port number (e.g., 587 for TLS, 465 for SSL)
    secure: true, // Set to true for SSL
    auth: {
        user: 'ofaseru@prime-pay.africa', // Your email address
        pass: '1234567890', // Your email password
    },
});


export async function sendOTPEmail(email: string): Promise<any> {

    try {

        let otp = await generateOTP();

        console.log(`in email: ${email} send, otp: ${otp}`);

        const mailOptions = {
            from: '"Primepay" <ofaseru@prime-pay.africa>',
            to: email,
            subject: 'Hello from Primepay',
            text: `OTP is ${otp}`,
        };

        const info = await transporter.sendMail(mailOptions);
        // console.log('Email sent:', info.response);

        return {
            success: true,
            otp: otp,
            info: info
        };
    } catch (error) {
        console.log("in email otp : error: ", error)
        return {
            success: false
        }
    }

}