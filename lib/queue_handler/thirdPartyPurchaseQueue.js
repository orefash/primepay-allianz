"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerTPP = void 0;
const Queue = require("bull");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const redisConnection_1 = require("./redisConnection");
const allianz_func_1 = require("../main/allianz_func");
const manychatHelper_1 = require("../helper/manychatHelper");
const tppQueue = new Queue("tpp", redisConnection_1.default);
tppQueue.process(async (job) => {
    let params = job.data.params;
    console.log("In PPQ");
    let pData = await (0, allianz_func_1.purchase3rdParty)(params);
    console.log("Res: ", pData);
    if (pData.isValid) {
        let responseData = await (0, manychatHelper_1.setPolicyFields)(job.data.contactId, pData.data.referenceId, pData.data.certificateNumber);
        console.log("tpp policy: ", responseData);
        if (responseData) {
            let sendFlowResp = await (0, manychatHelper_1.sendFlow)(job.data.contactId, "policy_confirm");
            console.log("tpp send flow: ", sendFlowResp);
        }
    }
});
async function triggerTPP(params, contactId) {
    tppQueue.add({ params, contactId });
}
exports.triggerTPP = triggerTPP;
//# sourceMappingURL=thirdPartyPurchaseQueue.js.map