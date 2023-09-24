import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import * as redisConnection from "./src/helper/redis_helper";
import * as allianzFunc from "./src/main/allianz_func";
import * as allianzHelper from "./src/main/allianz_helper";
import * as emailHelper from "./src/helper/emailHelper";
import * as paystackFunc from "./src/main/paystack";
import * as manychatHelper from "./src/helper/manychatHelper";
import { config as dotenvConfig } from "dotenv";
import { PurchaseComprehensiveDto, PurchaseDto } from "./src/dto/purchase3rdParty.dto"; // Update with the correct import
import { validateComprehensivePurchaseDto, validatePurchaseDto } from "./src/helper/validatePurchase"
import { FileUploadDto, MultipleFileUploadDto, ValidateQuoteDto, requestQuoteDto } from "./src/types/appTypes";
import { validateFileUploadDto, validateFilesUploadDto, validateMotorQuoteBody, validateQuoteChoice } from "./src/helper/dtoValidator";
import * as queueHelper from "./src/queue_handler/queue";
import { triggerTPP, } from "./src/queue_handler/thirdPartyPurchaseQueue";
import { triggerCPQ } from "./src/queue_handler/comprehensivePurchaseQueue";
import { triggerUploadImage } from "./src/queue_handler/uploadFileQueue";
import { triggerUploadImages } from "./src/queue_handler/uploadFilesQueue";
import { downloadAndUploadImage } from "./src/helper/awsS3Helper";
dotenvConfig();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "*", // (Whatever your frontend URL is)
    credentials: true,
}));

const serverStatus = () => {
    queueHelper.purchaseThirdPartyQueue.addToQueue({ test: "testing data" })
    return {
        state: "up",
    };
};


app.get("/api/test-upload", async (req, res) => {

    await downloadAndUploadImage();

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
    let pData: FileUploadDto | null = validateFileUploadDto(req.body);

    if(!pData){
        res.status(400);
    }

    await triggerUploadImage(pData);

    res.status(200).json({
        success: true
    });

});

app.post("/upload-multiple-docs/user/:contactId", async (req, res) => {
    // let regNo = req.body.regNo;
    // console.log("req: ", req.body)
    let contactId = req.params.contactId;

    let pData: MultipleFileUploadDto | null = validateFilesUploadDto({...req.body, contactId});

    if(!pData){
        res.status(400);
    }

    await triggerUploadImages(pData);

    res.status(200).json({
        success: true
    });

});


app.post("/create-payment-link", async (req, res) => {
    // let regNo = req.body.regNo;
    // console.log("req: ", req.body)
    const data = await paystackFunc.createPaymentLink(req.body);

    res.status(200).json({
        fstatus: data.success ? 1 : 0,
        ...data
    });

});


app.get("/pay-validate/:ref", async (req, res) => {
    // let regNo = req.body.regNo;
    // console.log("req: ", req.body)
    let reference = req.params.ref;

    const data = await paystackFunc.verifyPayment(reference);

    res.status(200).json({
        fstatus: data.success ? 1 : 0,
        ...data
    });

});


app.get("/api/callback-manychat", (req, res) => {

    res.status(200).json({
        data: req.query,
        status: serverStatus(),
    });
});

app.get("/api/callback-manychat/user/:txt", async (req, res) => {

    console.log("in callback: ", req.params.txt)
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
    console.log("in tpp req: ", req.body)
    let pData: PurchaseDto | null = validatePurchaseDto(req.body);


    console.log("pdata: ", pData);

    let contactId = req.params.contactId;

    if (!pData) {
        res.status(200).json({
            success: false
        })
    } else {
        await triggerTPP(pData, contactId);
        res.status(200).json({
            success: true
        });
    }

});

app.post("/purchase-comprehensive/user/:contactId", async (req, res) => {
    console.log("in comp: ", req.body);
    let pData: PurchaseComprehensiveDto | null = validateComprehensivePurchaseDto(req.body);


    console.log("pdata: ", pData);

    let contactId = req.params.contactId;

    if (!pData) {
        res.status(200).json({
            success: false
        })
    } else {
        await triggerCPQ(pData, contactId);
        res.status(200).json({
            success: true
        });
    }

});


app.post("/get-comprehensive-quote", async (req, res) => {
    console.log("in get quote: ", req.body);

    const pData: requestQuoteDto | null = validateMotorQuoteBody(req.body);

    console.log("post validate: ", pData);

    if (!pData) {
        res.status(200).json({
            success: false
        })
    }

    const data = await allianzFunc.getComprehensiveQuote(pData);


    console.log("in validate quote data: ", data);

    const { isValid, ...responseData } = data;
    // console.log("in comp: ", data)
    // data.isValid = true;
    res.status(200).json({
        // success: false,
        rstatus: data.isValid ? 1 : 0,
        success: data.isValid,
        ...responseData,
    });
});


app.post("/validate-quote", async (req, res) => {
    console.log("in validate quote: ", req.body);

    const pData: ValidateQuoteDto | null = validateQuoteChoice(req.body);

    if (!pData) {
        res.status(200).json({
            success: false,
            rstatus: 0
        })
    }

    const data = await allianzHelper.validateQuoteChoice(pData);

    // const { isValid, ...responseData } = data;

    // console.log("in get quo: ", data)
    // data.isValid = true;
    res.status(200).json({
        success: data.success,
        rstatus: data.success ? 1 : 0,
        ...data
    });
});



app.get("/validate-email/:email", async (req, res) => {

    const email: string = req.params.email;
    console.log("in email: ", email)

    if (!email) {
        res.status(200).json({
            success: false,
            rstatus: 0
        })
    }

    const data = await emailHelper.sendOTPEmail(email);

    console.log("Output: ", data);


    res.status(200).json({
        ...data,
        rstatus: data.success ? 1 : 0
    });
});


const PORT = process.env.PORT || 3900;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
