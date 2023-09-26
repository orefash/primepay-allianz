"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createPaymentLink = void 0;
const axios_1 = require("axios");
// import { URLSearchParams } from "url";
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function createPaymentLink(reqData) {
    try {
        const IS_PAYSTACK_LIVE = process.env.PS_IS_LIVE;
        if (!IS_PAYSTACK_LIVE)
            throw new Error("Paystack Flag Invalid");
        const PAYSTACK_TURL = "https://api.paystack.co/transaction/initialize";
        let pkey = null;
        if (IS_PAYSTACK_LIVE === "0") {
            pkey = process.env.PAYSTACK_PRIV_TEST_KEY;
        }
        else {
            pkey = process.env.PAYSTACK_PRIV_LIVE_KEY;
        }
        const instance = axios_1.default.create({
            baseURL: `${PAYSTACK_TURL}`,
        });
        const headers = {
            Authorization: `Bearer ${pkey}`,
        };
        reqData.amount = `${parseFloat(reqData.amount) * 100}`;
        const body = reqData;
        const response = await instance.post("/", body, { headers });
        if (response.status != 200)
            throw new Error("Paystack API Error");
        let respData = response.data;
        if (!respData.status)
            throw new Error("Paystack API Failed Status");
        // console.log(respData)
        return Object.assign({ success: true }, respData);
    }
    catch (error) {
        console.log("Error initiating transaction: ", error);
        return {
            success: false
        };
    }
}
exports.createPaymentLink = createPaymentLink;
async function verifyPayment(reference) {
    try {
        const PAYSTACK_TURL = "https://api.paystack.co/transaction/verify";
        const IS_PAYSTACK_LIVE = process.env.PS_IS_LIVE;
        if (!IS_PAYSTACK_LIVE)
            throw new Error("Paystack Flag Invalid");
        let pkey = null;
        if (IS_PAYSTACK_LIVE === "0") {
            pkey = process.env.PAYSTACK_PRIV_TEST_KEY;
        }
        else {
            pkey = process.env.PAYSTACK_PRIV_LIVE_KEY;
        }
        const instance = axios_1.default.create({
            baseURL: `${PAYSTACK_TURL}`,
        });
        const headers = {
            Authorization: `Bearer ${pkey}`,
        };
        const response = await instance.get(`/${reference}`, { headers });
        if (response.status != 200)
            throw new Error("Paystack API Error");
        let respData = response.data;
        if (!respData.status)
            throw new Error("Paystack API Failed Status");
        // console.log(respData)
        return {
            success: true,
            payStatus: respData.data.status
        };
    }
    catch (error) {
        console.log("Error initiating transaction: ", error);
        return {
            success: false
        };
    }
}
exports.verifyPayment = verifyPayment;
//# sourceMappingURL=paystack.js.map