
interface TransactionData {
    authorization_url: string;
    access_code: string;
    reference: string;
}

export interface InitiateTransactionResponse {
    status: boolean;
    message: string;
    data?: TransactionData;
}


export interface CreatePaymentLinkRequest {
    email:string;
    amount: string;
    callback_url: string;
    isComprehensive?: boolean;
}