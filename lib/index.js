"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const redisConnection = require("./helper/redis_helper");
const dotenv_1 = require("dotenv");
const queueHelper = require("./queue_handler/queue");
const mailer_routes_1 = require("./routes/mailer.routes");
const paystack_routes_1 = require("./routes/paystack.routes");
const allianz_routes_1 = require("./routes/allianz.routes");
const manychat_routes_1 = require("./routes/manychat.routes");
(0, dotenv_1.config)();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    credentials: true,
}));
const serverStatus = () => {
    queueHelper.purchaseThirdPartyQueue.addToQueue({ test: "testing data" });
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
});
app.use('/', mailer_routes_1.default);
app.use('/', paystack_routes_1.default);
app.use('/', allianz_routes_1.default);
app.use('/', manychat_routes_1.default);
const PORT = process.env.PORT || 3900;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map