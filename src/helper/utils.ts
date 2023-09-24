

export async function generateOTP(): Promise<number> {
    // Generate a random 5-digit OTP
    const otp = Math.floor(10000 + Math.random() * 90000);
    return otp;
}