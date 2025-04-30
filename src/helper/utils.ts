

export async function generateOTP(): Promise<number> {
    // Generate a random 5-digit OTP
    const otp = Math.floor(10000 + Math.random() * 90000);
    return otp;
}


export async function generateApplicationReference(): Promise<string> {
    const prefix = 'PP-WA';
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    const randomLength = 4;
    for (let i = 0; i < randomLength; i++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return `${prefix}-${year}${month}${day}${hour}${minute}${second}-${randomPart}`;
}