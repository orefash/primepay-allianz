import * as Queue from "bull";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import opts from "./redisConnection";
import { purchaseComprehensive } from "../main/allianz_func";
import { PurchaseComprehensiveDto, PurchaseDto } from "../dto/purchase3rdParty.dto";
import { sendFlow, setPolicyFields } from "../helper/manychatHelper";

import { logger } from "../logger/index";

const comprehensivePQueue = new Queue("cpq", opts);

export async function purchaseComprehensiveRun(params: PurchaseComprehensiveDto, contactId: string) {

    let pData = await purchaseComprehensive(params);

    logger.info("Res: ", pData);

    if (pData.isValid) {
        let responseData = await setPolicyFields(contactId, pData.data.referenceId);

        logger.info("cpp policy: ", responseData);

        if (responseData) {
            let sendFlowResp = await sendFlow(contactId, "policy_confirm");
            logger.info("cpq send flow: ", sendFlowResp);
            
            if(sendFlowResp) {
                return {
                    fstatus: 0,
                    message: "insurance purchased successfully"
                }
            }

            return {
                fstatus: 3,
                message: "error sending to policy confirm"
            }
            
        } else {
            return {
                fstatus: 2,
                message: "error setting policy fields"
            }
        }
    }else{
        logger.error("purchase comprehensive api error");

        return {
            fstatus: 1,
            message: pData.message
        }

    }

}


comprehensivePQueue.process(async (job) => {

    let params: PurchaseComprehensiveDto = job.data.params;
    console.log("In CPQ");
    let pData = await purchaseComprehensive(params);

    console.log("Res: ", pData);

    if (pData.isValid) {
        let responseData = await setPolicyFields(job.data.contactId, pData.data.referenceId);

        console.log("cpp policy: ", responseData);

        if (responseData) {
            let sendFlowResp = await sendFlow(job.data.contactId, "policy_confirm");
            console.log("cpq send flow: ", sendFlowResp);
        }
    }else {

        logger.error("pdata is invalid");
    }

})

export async function triggerCPQ(params: PurchaseDto, contactId: string) {
    comprehensivePQueue.add({ params, contactId });
}