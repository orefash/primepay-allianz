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
        }
    }else{
        throw new Error("Comprehensive Purchase Error, invalid pData")
    }

    logger.info("End of purchase run");

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