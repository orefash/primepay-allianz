import axios, { AxiosInstance } from "axios";
// import { URLSearchParams } from "url";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

// import * as redisConnection from "./redis_helper";
import { CreatePaymentLinkRequest, InitiateTransactionResponse } from "../types/paystackTypes";




export async function createPaymentLink(reqData: CreatePaymentLinkRequest): Promise<any> {
    try {
        const IS_PAYSTACK_LIVE: string | undefined = process.env.PS_IS_LIVE;

        if(!IS_PAYSTACK_LIVE)
            throw new Error("Paystack Flag Invalid")

        const PAYSTACK_TURL: string="https://api.paystack.co/transaction/initialize";
        
        let pkey = null;

        if(IS_PAYSTACK_LIVE === "0"){
            pkey = process.env.PAYSTACK_PRIV_TEST_KEY;
        }else{
            pkey = process.env.PAYSTACK_PRIV_LIVE_KEY;
        }

        const instance: AxiosInstance = axios.create({
            baseURL: `${PAYSTACK_TURL}`,
        });

        const headers = {
            Authorization: `Bearer ${pkey}`,
        };

        reqData.amount = `${parseFloat(reqData.amount) * 100}`

        const body = reqData;

        const response = await instance.post("/", body, { headers });

        if(response.status != 200)
            throw new Error("Paystack API Error");

        let respData: InitiateTransactionResponse = response.data;

        if(!respData.status)
            throw new Error("Paystack API Failed Status");

        // console.log(respData)

        return {
            success: true,
            ...respData
        };


    } catch (error) {
        console.log("Error initiating transaction: ", error)
        return {
            success: false
        }
    }
}



export async function verifyPayment(reference: string): Promise<any> {
    try {
        const PAYSTACK_TURL: string="https://api.paystack.co/transaction/verify";

        const IS_PAYSTACK_LIVE: string | undefined = process.env.PS_IS_LIVE;

        if(!IS_PAYSTACK_LIVE)
            throw new Error("Paystack Flag Invalid")

        
        let pkey = null;

        if(IS_PAYSTACK_LIVE === "0"){
            pkey = process.env.PAYSTACK_PRIV_TEST_KEY;
        }else{
            pkey = process.env.PAYSTACK_PRIV_LIVE_KEY;
        }

        const instance: AxiosInstance = axios.create({
            baseURL: `${PAYSTACK_TURL}`,
        });

        const headers = {
            Authorization: `Bearer ${pkey}`,
        };

        const response = await instance.get(`/${reference}`, { headers });

        if(response.status != 200)
            throw new Error("Paystack API Error");

        let respData = response.data;

        if(!respData.status)
            throw new Error("Paystack API Failed Status");

        // console.log(respData)

        return {
            success: true,
            payStatus: respData.data.status
        };


    } catch (error) {
        console.log("Error initiating transaction: ", error)
        return {
            success: false
        }
    }
}