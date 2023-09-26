"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer = require("nodemailer");
const utils_1 = require("./utils");
const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ofaseru@prime-pay.africa',
        pass: '1234567890', // Your email password
    },
});
async function sendOTPEmail(email) {
    try {
        let otp = await (0, utils_1.generateOTP)();
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
    }
    catch (error) {
        console.log("in email otp : error: ", error);
        return {
            success: false
        };
    }
}
exports.sendOTPEmail = sendOTPEmail;
//# sourceMappingURL=emailHelper.js.map