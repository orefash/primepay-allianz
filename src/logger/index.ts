// import expressWinston from "express-winston";
import { transports, format, createLogger } from 'winston';
import 'winston-mongodb';
// import { MongoDB } from 'winston-mongodb';
// import * as winstonMongoDB from 'winston-mongodb';
import * as expressWinston from 'express-winston';

const isProduction = process.env.NODE_ENV === 'production';


// console.log("Dev mongo uri: ", process.env.MONGO_URI_PROD_LOG)

const mongodbUri: string = ( isProduction ? process.env.MONGO_URI_PROD_LOG : process.env.MONGO_URI_DEV_LOG ) ?? "localhost:27017";

// console.log("Mongo uri: ", mongodbUri)


expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

import { MongoDBConnectionOptions } from 'winston-mongodb';

const mongodbLogOptions: MongoDBConnectionOptions = {
    db: mongodbUri, // Replace with your MongoDB connection URI
    options: {
        useUnifiedTopology: true,
    },
    collection: 'logs',
};


const mongodbUtilOptions: MongoDBConnectionOptions = {
    db: mongodbUri, // Replace with your MongoDB connection URI
    options: {
        useUnifiedTopology: true,
    },
    collection: 'util-logs',
};

const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.MongoDB(mongodbLogOptions)
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.metadata(),
        format.prettyPrint()
    )
});

const cronLogger = createLogger({
    transports: [
        new transports.Console(),
        new transports.MongoDB(mongodbUtilOptions)
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.metadata(),
        format.prettyPrint()
    )
});

const appLogger = expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true
});

export { appLogger, logger, cronLogger };
