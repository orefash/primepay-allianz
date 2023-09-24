
import * as Queue from "bull";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export const tpQueue = Queue("tpq", {
    redis: {
        host: '127.0.0.1',
        port: 5005,
        // password: 'root'
    }
})

async function testFN(email: string) {
    console.log("in job: ", email)
}

tpQueue.process(async job => {
    console.log("in process")
    return await testFN(job.data.email);
})

class QueueService {
    private opts = {
        host: '127.0.0.1',
        port: 5005,
    };
    private qName: string;
    processor: any;
    private queue: Queue.Queue;

    constructor(qName: string, processor: any) {
        this.qName = qName;
        this.processor = processor;

        this.queue = Queue(this.qName, {
            redis: this.opts
        });

        this.queue.process(async job => processor)
    }

    public async addToQueue(data: any, options?:any){
        this.queue.add(data, options);
    }
}

export const purchaseThirdPartyQueue = new QueueService("pThirdPary", testFN);

// const data = {
//     email: 'userid@domain.com'
// };

// const options = {
//     delay: 60000, // 1 min in ms
//     attempts: 2
// };
// // 2. Adding a Job to the Queue
// tpQueue.add(data, options);