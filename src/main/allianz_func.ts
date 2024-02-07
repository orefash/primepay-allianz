import axios, { AxiosInstance } from "axios";
import { URLSearchParams } from "url";
import * as FormData from 'form-data';
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import * as redisConnection from "../helper/redis_helper";
import { PurchaseComprehensiveDto, PurchaseDto } from "../dto/purchase3rdParty.dto";
import { FetchData, motorSizes, requestQuoteDto } from "../types/appTypes";

const AllianzBURL = process.env.ALLIANZ_BASE_URL;
// const accessToken = process.env.ALLIANZ_TEST_TOKEN;
// console.log(`in token - ${process.env.A_UNAME} : ${process.env.A_PASS}`);



async function getToken(): Promise<FetchData> {
    try {
        console.log("burl: ", AllianzBURL)
        const instance: AxiosInstance = axios.create({
            baseURL: `${AllianzBURL}`,
        });

        const params = new URLSearchParams();

        if (process.env.A_UNAME && process.env.A_PASS) {
            // console.log(`in token - ${process.env.A_UNAME} : ${process.env.A_PASS}`);
            params.append("username", process.env.A_UNAME);
            params.append("password", process.env.A_PASS);
            params.append("grant_type", "password");
        } else {
            throw new Error("A_UNAME or A_PASS environment variable is not set");
        }

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const response = await instance.post("/token", params, { headers });

        const data = response.data;

        // console.log('data resp: ', JSON.stringify(data));

        if (data.access_token) {
            return {
                atoken: data.access_token,
                expires: data['.expires'],
            };
        }

        throw new Error("Token not found");
    } catch (error) {
        console.log("Error fetching api token:");
        // console.log("Error fetching api token:", error);
        throw error;
    }
}

async function fetchToken(): Promise<string | null> {
    try {
        let userToken: string | null = null;
        const redis = redisConnection.connect();
        const fToken = await redis.get("ftoken");


        if (fToken) {
            console.log("allianz - redis token found: ", JSON.parse(fToken));
            const fTokenObj = JSON.parse(fToken);
            const expirationDate = new Date(fTokenObj["expires"]);
            const currentDate = new Date();

            if (expirationDate < currentDate) {
                console.log("redis token expired: ");
                const fetchData = await getToken();
                const strObj = JSON.stringify(fetchData);
                redis.set("ftoken", strObj);
                userToken = fetchData.atoken;
            } else {
                userToken = fTokenObj.atoken;
            }
        } else {
            // console.log("no redis token found: ");
            const fetchData = await getToken();
            const strObj = JSON.stringify(fetchData);
            redis.set("ftoken", strObj);
            userToken = fetchData.atoken;
        }

        redisConnection.close();
        return userToken;
    } catch (error) {
        console.log("Error fetching token:", error);
        throw error;
    } finally {
        redisConnection.close();
    }
}



async function uploadFiles(refId: string, docType: string, formData: FormData): Promise<any> {
    try {
        const token = await fetchToken();

        if (token == null) {
            throw new Error("Error getting Token");
        }

        const instance: AxiosInstance = axios.create({
            baseURL: `${AllianzBURL}`,
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            ...formData.getHeaders(),
        };

        // const data = {
        //     "RegistrationNo": regNo,
        // };

        const response = await instance.post(`${AllianzBURL}/MotorComprehensive/UploadFiles?ReferenceId=${refId}&DocumentName=${docType}`, formData, { headers });
        const isValid = response.status === 200;

        return {
            isValid: isValid,
            data: response.data
        };
    } catch (error) {
        console.log("Error uploading pic", error);
        throw error;
    }

    // return {
    //     isValid: false,
    // };
}


async function getAgents(): Promise<any> {
    try {
        const token = await fetchToken();

        if (token == null) {
            throw new Error("Error getting Token");
        }

        const instance: AxiosInstance = axios.create({
            baseURL: `${AllianzBURL}`,
        });

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await instance.get("/Motor/agents", { headers });
        return response.data;
    } catch (error) {
        console.log("Error fetching agents", error);
        throw error;
    }
}

async function getMotorSizes(): Promise<any> {
    try {
        let motorData: motorSizes[] | null = null;
        let redis = redisConnection.connect();

        const vehicleList = await redis.get("m_vehicles");
        redisConnection.close();

        if (!vehicleList) {
            let token = await fetchToken();

            if (token == null) {
                throw new Error("Error getting Token");
            }

            const instance: AxiosInstance = axios.create({
                baseURL: `${AllianzBURL}`,
            });

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await instance.post("/Motor/Vehicles", null, { headers });
            motorData = response.data;

            if (motorData) {
                redis = redisConnection.connect();
                redis.set("m_vehicles", JSON.stringify(motorData));
            }
        } else {
            motorData = JSON.parse(vehicleList);
        }

        if (!motorData) {
            throw new Error("Error fetching Motor Data");
        }

        // console.log("data; ", motorData);

        const newData = motorData.map((item: any) => {
            return `${item.VehicleSizeId}. ${item.Size}`;
        }).join('\n');

        return {
            success: true,
            sizes: newData,
            length: motorData.length,
        };
    } catch (error) {
        console.log("Error fetching sizes", error);
        throw error;
    } finally {
        redisConnection.close();
    }
}

async function getAmountByMotorSizes(sizeId: string): Promise<any> {
    try {
        let motorData: motorSizes[] | null = null;
        let redis = redisConnection.connect();

        const vehicleList = await redis.get("m_vehicles");
        redisConnection.close();

        if (!vehicleList) {
            let token = await fetchToken();

            if (token == null) {
                throw new Error("Error getting Token");
            }

            const instance: AxiosInstance = axios.create({
                baseURL: `${AllianzBURL}`,
            });

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await instance.post("/Motor/Vehicles", null, { headers });
            motorData = response.data;

            if (motorData) {
                redis = redisConnection.connect();
                redis.set("m_vehicles", JSON.stringify(motorData));
            }
        } else {
            motorData = JSON.parse(vehicleList);
        }

        if (!motorData) {
            throw new Error("Error fetching Motor Data");
        }

        // console.log("data; ", motorData);

        // console.log("Type", typeof(sizeId))
        let sizeIdNo = parseInt(sizeId)

        const vehicle: motorSizes | undefined = motorData.find(vehicle => vehicle.VehicleSizeId === sizeIdNo);

        if (!vehicle) {
            throw new Error("Invalid Motor Size")
        }

        // const newData = motorData.map((item: any) => {
        //     return `${item.VehicleSizeId}. ${item.Size}`;
        // }).join('\n');

        return {
            success: true,
            ...vehicle
        };
    } catch (error) {
        redisConnection.close();
        console.log("Error fetching sizes", error);
        // throw error;
        return {
            success: false
        }
    }
}

async function validateMotor(regNo: string): Promise<any> {
    try {
        const token = await fetchToken();

        if (token == null) {
            throw new Error("Error getting Token");
        }

        const instance: AxiosInstance = axios.create({
            baseURL: `${AllianzBURL}`,
        });

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const data = {
            "RegistrationNo": regNo,
        };

        const response = await instance.post("/motor/validate", data, { headers });
        const isValid = response.status === 200;

        return {
            isValid: isValid,
        };
    } catch (error) {
        console.log("Error fetching sizes", error);
        throw error;
    }

    // return {
    //     isValid: false,
    // };
}


async function purchase3rdParty(pData: PurchaseDto): Promise<any> {
    try {
        if (pData == null) {
            throw new Error("Error with Purchase Data");
        }

        const token = await fetchToken();

        if (token == null) {
            throw new Error("Error getting Token");
        }

        // pData.payment = {
        //     "paymentReference": "R15934356803452",
        //     "amountPaid": "5000"
        // }
        const instance: AxiosInstance = axios.create({
            baseURL: `${AllianzBURL}`,
        });

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const data = pData;

        const response = await instance.post("/Motor/PurchaseMotorThirdParty", data, { headers });
        const isValid = response.status === 200;
        const respData = response.data;

        return {
            isValid: isValid,
            data: respData
        };
    } catch (error) {
        console.log("Error Purchasing Thrid Party", error);
        // throw error;
        return {
            isValid: false
        }
    }

}




async function purchaseComprehensive(pData: PurchaseComprehensiveDto): Promise<any> {
    try {
        if (pData == null) {
            throw new Error("Error with Purchase Data");
        }

        const token = await fetchToken();

        if (token == null) {
            throw new Error("Error getting Token");
        }

        // pData.payment = {
        //     "paymentReference": "R15934356803452",
        //     "amountPaid": "5000"
        // }
        const instance: AxiosInstance = axios.create({
            baseURL: `${AllianzBURL}`,
        });

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const data = pData;

        const response = await instance.post("/MotorComprehensive/Purchase", data, { headers });
        const isValid = response.status === 200;
        const respData = response.data;

        return {
            isValid: isValid,
            data: respData
        };
    } catch (error) {
        console.log("Error Purchasing COmprehensive", error);
        // throw error;
        return {
            isValid: false
        }
    }

}



async function getComprehensiveQuote(pData: requestQuoteDto | null): Promise<any> {

    try {
        // console.log("pdata; ", pData)
        if (pData == null) {
            throw new Error("Error with Request Data");
        }

        const token = await fetchToken();

        if (token == null) {
            throw new Error("Error getting Token");
        }

        const instance: AxiosInstance = axios.create({
            baseURL: `${AllianzBURL}`,
        });

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const data = pData;

        const response = await instance.post("/MotorComprehensive/quote", data, { headers });
        const isValid = response.status === 200;
        const respData = response.data;

        let classicData = respData["Classic"];
        console.log("in get quote: ", classicData);


        const formattedArray = Object.keys(classicData)
            .filter(key => classicData[key] !== null)
            .map((key, index) => {
                let value = classicData[key];
                value = value.replace(/ *\([^)]*\) */g, ''); // Remove text inside parentheses
                return `${index+1}. ${key}: ${'N'+value}`;
            });

        // console.log("fm: ", formattedArray)
        // console.log("fm ln: ", formattedArray.length)

        return {
            isValid: isValid,
            data: JSON.stringify(classicData),
            message: formattedArray.join('\n'),
            length: formattedArray.length
        };
    } catch (error) {
        console.log("Error fetching sizes", error);
        // throw error;
        return {
            isValid: false
        }
    }

}


export { uploadFiles, getComprehensiveQuote, getAmountByMotorSizes, purchase3rdParty,purchaseComprehensive ,getToken, getAgents, getMotorSizes, fetchToken, validateMotor };
