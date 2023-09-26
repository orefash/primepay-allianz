"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const redisConnection = require("./helper/redis_helper");
const allianzFunc = require("./main/allianz_func");
const allianzHelper = require("./main/allianz_helper");
const emailHelper = require("./helper/emailHelper");
const paystackFunc = require("./main/paystack");
const manychatHelper = require("./helper/manychatHelper");
const dotenv_1 = require("dotenv");
const validatePurchase_1 = require("./helper/validatePurchase");
const dtoValidator_1 = require("./helper/dtoValidator");
const queueHelper = require("./queue_handler/queue");
const thirdPartyPurchaseQueue_1 = require("./queue_handler/thirdPartyPurchaseQueue");
const comprehensivePurchaseQueue_1 = require("./queue_handler/comprehensivePurchaseQueue");
const uploadFileQueue_1 = require("./queue_handler/uploadFileQueue");
const uploadFilesQueue_1 = require("./queue_handler/uploadFilesQueue");
const awsS3Helper_1 = require("./helper/awsS3Helper");
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
app.get("/api/test-upload", async (req, res) => {
    await (0, awsS3Helper_1.downloadAndUploadImage)();
    res.status(200).json({
        data: `${process.env.TEST_VAL}`,
        status: serverStatus(),
    });
});
app.get("/api/uptime", (req, res) => {
    res.status(200).json({
        data: `${process.env.TEST_VAL}`,
        status: serverStatus(),
    });
});
app.post("/upload-doc", async (req, res) => {
    // let regNo = req.body.regNo;
    // console.log("req: ", req.body)
    let pData = (0, dtoValidator_1.validateFileUploadDto)(req.body);
    if (!pData) {
        res.status(400);
    }
    await (0, uploadFileQueue_1.triggerUploadImage)(pData);
    res.status(200).json({
        success: true
    });
});
app.post("/upload-multiple-docs/user/:contactId", async (req, res) => {
    // let regNo = req.body.regNo;
    // console.log("req: ", req.body)
    let contactId = req.params.contactId;
    let pData = (0, dtoValidator_1.validateFilesUploadDto)(Object.assign(Object.assign({}, req.body), { contactId }));
    if (!pData) {
        res.status(400);
    }
    await (0, uploadFilesQueue_1.triggerUploadImages)(pData);
    res.status(200).json({
        success: true
    });
});
app.post("/create-payment-link", async (req, res) => {
    // let regNo = req.body.regNo;
    // console.log("req: ", req.body)
    const data = await paystackFunc.createPaymentLink(req.body);
    res.status(200).json(Object.assign({ fstatus: data.success ? 1 : 0 }, data));
});
app.get("/pay-validate/:ref", async (req, res) => {
    // let regNo = req.body.regNo;
    // console.log("req: ", req.body)
    let reference = req.params.ref;
    const data = await paystackFunc.verifyPayment(reference);
    res.status(200).json(Object.assign({ fstatus: data.success ? 1 : 0 }, data));
});
app.get("/api/callback-manychat", (req, res) => {
    res.status(200).json({
        data: req.query,
        status: serverStatus(),
    });
});
app.get("/api/callback-manychat/user/:txt", async (req, res) => {
    console.log("in callback: ", req.params.txt);
    let contactId = req.params.txt;
    let data = await manychatHelper.sendFlow(contactId, "pay_confirm");
    res.status(200).json({
        data: data,
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
app.get("/api/ftoken", async (req, res) => {
    let token = await allianzFunc.fetchToken();
    res.status(200).json({
        data: `${token}`,
        status: serverStatus(),
    });
});
app.get("/api/agents", async (req, res) => {
    let agents = await allianzFunc.getAgents();
    res.status(200).json({
        data: agents,
        status: serverStatus(),
    });
});
app.get("/motor-sizes", async (req, res) => {
    const data = await allianzFunc.getMotorSizes();
    res.status(200).json({
        data: data,
    });
});
app.get("/motor-sizes/premium/:size", async (req, res) => {
    const size = req.params.size;
    const data = await allianzFunc.getAmountByMotorSizes(size);
    res.status(200).json(data);
});
app.post("/validate-motor", async (req, res) => {
    let regNo = req.body.regNo;
    const data = await allianzFunc.validateMotor(regNo);
    res.status(200).json({
        success: true,
        data: data,
    });
});
app.post("/purchase-3rd-party/user/:contactId", async (req, res) => {
    console.log("in tpp req: ", req.body);
    let pData = (0, validatePurchase_1.validatePurchaseDto)(req.body);
    console.log("pdata: ", pData);
    let contactId = req.params.contactId;
    if (!pData) {
        res.status(200).json({
            success: false
        });
    }
    else {
        await (0, thirdPartyPurchaseQueue_1.triggerTPP)(pData, contactId);
        res.status(200).json({
            success: true
        });
    }
});
app.post("/purchase-comprehensive/user/:contactId", async (req, res) => {
    console.log("in comp: ", req.body);
    let pData = (0, validatePurchase_1.validateComprehensivePurchaseDto)(req.body);
    console.log("pdata: ", pData);
    let contactId = req.params.contactId;
    if (!pData) {
        res.status(200).json({
            success: false
        });
    }
    else {
        await (0, comprehensivePurchaseQueue_1.triggerCPQ)(pData, contactId);
        res.status(200).json({
            success: true
        });
    }
});
app.post("/get-comprehensive-quote", async (req, res) => {
    console.log("in get quote: ", req.body);
    const pData = (0, dtoValidator_1.validateMotorQuoteBody)(req.body);
    console.log("post validate: ", pData);
    if (!pData) {
        res.status(200).json({
            success: false
        });
    }
    const data = await allianzFunc.getComprehensiveQuote(pData);
    console.log("in validate quote data: ", data);
    const { isValid } = data, responseData = __rest(data, ["isValid"]);
    // console.log("in comp: ", data)
    // data.isValid = true;
    res.status(200).json(Object.assign({ 
        // success: false,
        rstatus: data.isValid ? 1 : 0, success: data.isValid }, responseData));
});
app.post("/validate-quote", async (req, res) => {
    console.log("in validate quote: ", req.body);
    const pData = (0, dtoValidator_1.validateQuoteChoice)(req.body);
    if (!pData) {
        res.status(200).json({
            success: false,
            rstatus: 0
        });
    }
    const data = await allianzHelper.validateQuoteChoice(pData);
    // const { isValid, ...responseData } = data;
    // console.log("in get quo: ", data)
    // data.isValid = true;
    res.status(200).json(Object.assign({ success: data.success, rstatus: data.success ? 1 : 0 }, data));
});
app.get("/validate-email/:email", async (req, res) => {
    const email = req.params.email;
    console.log("in email: ", email);
    if (!email) {
        res.status(200).json({
            success: false,
            rstatus: 0
        });
    }
    const data = await emailHelper.sendOTPEmail(email);
    console.log("Output: ", data);
    res.status(200).json(Object.assign(Object.assign({}, data), { rstatus: data.success ? 1 : 0 }));
});
const PORT = process.env.PORT || 3900;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map