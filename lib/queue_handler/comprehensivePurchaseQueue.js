"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerCPQ = void 0;
const Queue = require("bull");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const redisConnection_1 = require("./redisConnection");
const allianz_func_1 = require("../main/allianz_func");
const manychatHelper_1 = require("../helper/manychatHelper");
const comprehensivePQueue = new Queue("cpq", redisConnection_1.default);
comprehensivePQueue.process(async (job) => {
    let params = job.data.params;
    console.log("In CPQ");
    let pData = await (0, allianz_func_1.purchaseComprehensive)(params);
    console.log("Res: ", pData);
    if (pData.isValid) {
        let responseData = await (0, manychatHelper_1.setPolicyFields)(job.data.contactId, pData.data.referenceId);
        console.log("cpp policy: ", responseData);
        if (responseData) {
            let sendFlowResp = await (0, manychatHelper_1.sendFlow)(job.data.contactId, "policy_confirm");
            console.log("cpq send flow: ", sendFlowResp);
        }
    }
});
async function triggerCPQ(params, contactId) {
    comprehensivePQueue.add({ params, contactId });
}
exports.triggerCPQ = triggerCPQ;
//# sourceMappingURL=comprehensivePurchaseQueue.js.map