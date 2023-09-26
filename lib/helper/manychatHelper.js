"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPolicyFields = exports.sendFlow = void 0;
const axios_1 = require("axios");
// import { URLSearchParams } from "url";
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// const AllianzBURL = "https://api.manychat.com/fb/sending/sendFlow";
const flowDict = {
    "pay_confirm": process.env.MANY_PAY_FLOW,
    "policy_confirm": process.env.MANY_POLICY_FLOW,
    "upload_confirm": process.env.MANY_UPLOAD_CONFIRM
};
async function sendFlow(contactId, flowType) {
    try {
        let manychatSendFlowUrl = "https://api.manychat.com/fb/sending/sendFlow";
        let manychatKEY = process.env.MANYCHAT_KEY;
        // let flow = process.env.MANY_PAY_FLOW;
        let flow = flowDict[flowType];
        // console.log("flow: ", flow)
        // console.log("key: ", manychatKEY)
        const instance = axios_1.default.create({
            baseURL: `${manychatSendFlowUrl}`,
        });
        const headers = {
            Authorization: `Bearer ${manychatKEY}`,
        };
        const body = {
            "subscriber_id": contactId,
            "flow_ns": flow
        };
        const response = await instance.post("", body, { headers });
        console.log("in send flow: ", response.data);
        if (response.status === 200) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.log("Error: ", error);
        return false;
    }
}
exports.sendFlow = sendFlow;
async function setPolicyFields(contactId, referenceID, certificateNumber) {
    try {
        let manychatSendFlowUrl = "https://api.manychat.com/fb/subscriber/setCustomFields";
        let manychatKEY = process.env.MANYCHAT_KEY;
        const instance = axios_1.default.create({
            baseURL: `${manychatSendFlowUrl}`,
        });
        const headers = {
            Authorization: `Bearer ${manychatKEY}`,
        };
        let dlist = [
            {
                "field_name": "AllianzRefId",
                "field_value": referenceID
            }
        ];
        if (certificateNumber) {
            dlist.push({
                "field_name": "allianzCertNo",
                "field_value": certificateNumber
            });
        }
        const body = {
            "subscriber_id": contactId,
            "fields": dlist
        };
        console.log("set fields body: ", body);
        const response = await instance.post("", body, { headers });
        if (response.status === 200) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.log("Error: ", error);
        return false;
    }
}
exports.setPolicyFields = setPolicyFields;
//# sourceMappingURL=manychatHelper.js.map