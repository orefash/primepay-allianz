import axios, { AxiosInstance } from "axios";
// import { URLSearchParams } from "url";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

// const AllianzBURL = "https://api.manychat.com/fb/sending/sendFlow";


const flowDict: { [key: string]: string | undefined } = {
    "pay_confirm": process.env.MANY_PAY_FLOW,
    "policy_confirm": process.env.MANY_POLICY_FLOW,
    "upload_confirm": process.env.MANY_UPLOAD_CONFIRM
};

export async function sendFlow(contactId: string, flowType: string): Promise<boolean> {

    try {

        let manychatSendFlowUrl = "https://api.manychat.com/fb/sending/sendFlow";
        let manychatKEY = process.env.MANYCHAT_KEY;
        // let flow = process.env.MANY_PAY_FLOW;
        let flow = flowDict[flowType];

        // console.log("flow: ", flow)
        // console.log("key: ", manychatKEY)


        const instance: AxiosInstance = axios.create({
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

        console.log("in send flow: ", response.data)

        if(response.status === 200){
            return true
        }

        return false;


    } catch (error) {

        console.log("Error: ", error)

        return false;

    }

}


export async function setPolicyFields(contactId: string, referenceID: string, certificateNumber?: string): Promise<boolean> {

    try {

        let manychatSendFlowUrl = "https://api.manychat.com/fb/subscriber/setCustomFields";
        let manychatKEY = process.env.MANYCHAT_KEY;


        const instance: AxiosInstance = axios.create({
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

        if(certificateNumber){
            dlist.push({
                "field_name": "allianzCertNo",
                "field_value": certificateNumber
            })
        }

        const body = {
            "subscriber_id": contactId,
            "fields": dlist
        };

        console.log("set fields body: ", body)

        const response = await instance.post("", body, { headers });

        if (response.status === 200) {
            return true;
        }
        return false

    } catch (error) {

        console.log("Error: ", error)

        return false

    }

}