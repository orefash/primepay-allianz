
export interface PaylinkData {
    email: string;
    amount: string;
    callback_url: string;
    reference?: string;
}

export interface ProcessPaylink { success: boolean; data?: PaylinkData; message?: string; }


/**
 * Generates a 4-character unique string.
 * @returns A 4-character unique string.
 */
function generateUniqueCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export async function processPaylinkRequest(body: any, tranId: string): Promise<ProcessPaylink> {
    // Basic validation: Check if the required fields are present
    if (!body.email || !body.amount || !body.callback_url) {
        return {
            success: false,
            message: 'Missing required fields: email, amount, and callback_url are required.',
        };
    }

    // More detailed validation can be added here, e.g.,
    // - Check if email is a valid email address
    // - Check if amount is a valid number
    // - Check if callback_url is a valid URL

    const paylinkData: PaylinkData = 
    {
        email: body.email,
        amount: body.amount,
        callback_url: body.callback_url,
    };

    const uniqueCode = generateUniqueCode();
    paylinkData.reference = `${tranId}-${uniqueCode}`;

    console.log("Paylink Pricess data: ", paylinkData);


    return { success: true, data: paylinkData };
}