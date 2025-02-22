import * as Queue from "bull";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import opts from "./redisConnection";
import { purchase3rdParty } from "../main/allianz_func";
import { PurchaseDto } from "../dto/purchase3rdParty.dto";
import { setPolicyFields, sendFlow } from "../helper/manychatHelper";
import { logger } from "../logger/index";

const tppQueue = new Queue("tpp", opts);

export async function purchaseRun (params: PurchaseDto, contactId: string){

    let pData = await purchase3rdParty(params);

    console.log("Res: ", pData);
    if (pData.isValid) {
        let responseData = await setPolicyFields(contactId, pData.data.referenceId, pData.data.certificateNumber);

        console.log("tpp policy: ", responseData);

        logger.info("testing the service");

        if (responseData) {
            let sendFlowResp = await sendFlow(contactId, "policy_confirm");
            console.log("tpp send flow: ", sendFlowResp);
        }
    } else {
        logger.error("pdata is invalid");
    }

    logger.info("End of purchase run");
}

tppQueue.process(async (job) => {

    try {



        logger.info("testing the service in pp")

        console.log("In PPQ: ");
        let params: PurchaseDto = job.data.params;
        console.log("In PPQ: ");
        let pData = await purchase3rdParty(params);

        console.log("Res: ", pData);
        if (pData.isValid) {
            let responseData = await setPolicyFields(job.data.contactId, pData.data.referenceId, pData.data.certificateNumber);

            console.log("tpp policy: ", responseData);

            logger.info("testing the service")

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

