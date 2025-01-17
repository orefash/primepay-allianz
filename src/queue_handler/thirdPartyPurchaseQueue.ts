import * as Queue from "bull";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import opts from "./redisConnection";
import { purchase3rdParty } from "../main/allianz_func";
import { PurchaseDto } from "../dto/purchase3rdParty.dto";
import { setPolicyFields, sendFlow } from "../helper/manychatHelper";

const tppQueue = new Queue("tpp", opts);

tppQueue.process(async (job) => {

    try {

        console.log("In PPQ: ");
        let params: PurchaseDto = job.data.params;
        console.log("In PPQ: ");
        let pData = await purchase3rdParty(params);

        console.log("Res: ", pData);
        if (pData.isValid) {
            let responseData = await setPolicyFields(job.data.contactId, pData.data.referenceId, pData.data.certificateNumber);

            console.log("tpp policy: ", responseData);

            if (responseData) {
                let sendFlowResp = await sendFlow(job.data.contactId, "policy_confirm");
                console.log("tpp send flow: ", sendFlowResp);
            }
        }

    } catch (error) {

        console.log("TPP Queue error: ", error)
    }


})

export async function triggerTPP(params: PurchaseDto, contactId: string) {
    tppQueue.add({ params, contactId });
}