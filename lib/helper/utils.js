"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
async function generateOTP() {
    // Generate a random 5-digit OTP
    const otp = Math.floor(10000 + Math.random() * 90000);
    return otp;
}
exports.generateOTP = generateOTP;
//# sourceMappingURL=utils.js.map