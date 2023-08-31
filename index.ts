import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as redisConnection from "./src/redis_helper";
import * as allianzFunc from "./src/allianz_func";
import { config as dotenvConfig } from "dotenv";
import { PurchaseDto } from "./src/dto/purchase3rdParty.dto"; // Update with the correct import
import { validatePurchaseDto } from "./src/helper/validatePurchase"
import { requestQuoteDto } from "./src/types/appTypes";
import { validateMotorQuoteBody } from "./src/helper/dtoValidator"
dotenvConfig();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "*", // (Whatever your frontend URL is)
    credentials: true,
}));

const serverStatus = () => {
    return {
        state: "up",
    };
};

app.get("/api/uptime", (req, res) => {
    res.status(200).json({
        data: `${process.env.TEST_VAL}`,
        status: serverStatus(),
    });
});

app.get("/api/test-redis", async (req, res) => {
    const redis = redisConnection.connect();

    let obj = {
        a: 2,
        b: 3,
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

app.post("/purchase-3rd-party", async (req, res) => {
    let pData: PurchaseDto | null = validatePurchaseDto(req.body);

    if(!pData){
        res.status(200).json({
            success: false
        })
    }


    // console.log("PDATA: ", pData)

    const data = await allianzFunc.purchase3rdParty(pData);
    const { isValid, ...responseData } = data;
    res.status(200).json({
        success: data.isValid,
        ...responseData,
    });
});


app.post("/get-comprehensive-quote", async (req, res) => {
    // let pData: PurchaseDto | null = validatePurchaseDto(req.body);
    const pData: requestQuoteDto | null = validateMotorQuoteBody(req.body);
    
    if(!pData){
        res.status(200).json({
            success: false
        })
    }

    const data = await allianzFunc.getComprehensiveQuote(pData);
    
    const { isValid, ...responseData } = data;
    res.status(200).json({
        success: data.isValid,
        ...responseData,
    });
});



const PORT = process.env.PORT || 3900;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
