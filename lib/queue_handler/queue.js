"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseThirdPartyQueue = exports.tpQueue = void 0;
const Queue = require("bull");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.tpQueue = Queue("tpq", {
    redis: {
        host: '127.0.0.1',
        port: 5005,
        // password: 'root'
    }
});
async function testFN(email) {
    console.log("in job: ", email);
}
exports.tpQueue.process(async (job) => {
    console.log("in process");
    return await testFN(job.data.email);
});
class QueueService {
    constructor(qName, processor) {
        this.opts = {
            host: '127.0.0.1',
            port: 5005,
        };
        this.qName = qName;
        this.processor = processor;
        this.queue = Queue(this.qName, {
            redis: this.opts
        });
        this.queue.process(async (job) => processor);
    }
    async addToQueue(data, options) {
        this.queue.add(data, options);
    }
}
exports.purchaseThirdPartyQueue = new QueueService("pThirdPary", testFN);
// const data = {
//     email: 'userid@domain.com'
// };
// const options = {
//     delay: 60000, // 1 min in ms
//     attempts: 2
// };
// // 2. Adding a Job to the Queue
// tpQueue.add(data, options);
//# sourceMappingURL=queue.js.map