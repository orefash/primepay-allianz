import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import * as redisConnection from "./helper/redis_helper";
import { config as dotenvConfig } from "dotenv";
import * as queueHelper from "./queue_handler/queue";
import emailRouter from "./routes/mailer.routes";
import paystackRouter from "./routes/paystack.routes";
import allianzRouter from "./routes/allianz.routes";
import manychatRouter from "./routes/manychat.routes";
import staticsRouter from "./routes/statics.routes";

dotenvConfig();



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "*", // (Whatever your frontend URL is)
    credentials: true,
}));

// app.use(appLogger);

const serverStatus = () => {
    queueHelper.purchaseThirdPartyQueue.addToQueue({ test: "testing data" })

    return {
        state: "up",
    };
};


// app.get("/api/test-upload", async (req, res) => {

//     await downloadAndUploadImage();

//     res.status(200).json({
//         data: `${process.env.TEST_VAL}`,
//         status: serverStatus(),
//     });
// });


app.get("/api/uptime", (req, res) => {
    res.status(200).json({
        data: `${process.env.TEST_VAL}`,
        status: serverStatus(),
    });
});


app.get("/api/test-redis", async (req, res) => {
    try {
        const redis = redisConnection.connect();

        let obj = {
            a: 0,
            b: 1,
        };

        let stro = JSON.stringify(obj);

        await redis.set("ftoken", stro);

        const fToken1 = await redis.get("ftoken");

        console.log("ft: ", fToken1);

        await redis.set("ftoken", "as11");

        const fToken = await redis.get("ftoken");

        await redis.del("ftoken");

        redisConnection.close();

        res.status(200).json({
            data: `${fToken}`,
            status: serverStatus(),
        });
    } catch (error) {
        console.error("Error in /api/test-redis:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



// app.get("/api/test-redis", async (req, res) => {

//     const redis = redisConnection.connect();

//     let obj = {
//         a: 0,
//         b: 1,
//     };

//     let stro = JSON.stringify(obj);

//     await redis.set("ftoken", stro);

//     const fToken1 = await redis.get("ftoken");

//     console.log("ft: ", fToken1);

//     await redis.set("ftoken", "as11");

//     const fToken = await redis.get("ftoken");

//     await redis.del("ftoken");

//     redisConnection.close();


//     res.status(200).json({
//         data: `${fToken}`,
//         status: serverStatus(),
//     });
// });


app.use('/', emailRouter);
app.use('/', paystackRouter);
app.use('/', allianzRouter);
app.use('/', manychatRouter);
app.use('/', staticsRouter);


const PORT = process.env.PORT || 3900;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
