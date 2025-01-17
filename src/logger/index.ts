// // import expressWinston from "express-winston";
// import { transports, format, createLogger } from 'winston';
// import 'winston-mongodb';
// // import { MongoDB } from 'winston-mongodb';
// // import * as winstonMongoDB from 'winston-mongodb';
// import * as expressWinston from 'express-winston';

// const isProduction = process.env.NODE_ENV === 'production';


// // console.log("Dev mongo uri: ", process.env.MONGO_URI_PROD_LOG)

// const mongodbUri: string = ( isProduction ? process.env.MONGO_URI_PROD_LOG : process.env.MONGO_URI_DEV_LOG ) ?? "localhost:27017";

// // console.log("Mongo uri: ", mongodbUri)


// expressWinston.requestWhitelist.push('body');
// expressWinston.responseWhitelist.push('body');

// import { MongoDBConnectionOptions } from 'winston-mongodb';

// const mongodbLogOptions: MongoDBConnectionOptions = {
//     db: mongodbUri, // Replace with your MongoDB connection URI
//     options: {
//         useUnifiedTopology: true,
//     },
//     collection: 'logs',
// };


// const mongodbUtilOptions: MongoDBConnectionOptions = {
//     db: mongodbUri, // Replace with your MongoDB connection URI
//     options: {
//         useUnifiedTopology: true,
//     },
//     collection: 'util-logs',
// };

// const logger = createLogger({
//     transports: [
//         new transports.Console(),
//         new transports.MongoDB(mongodbLogOptions)
//     ],
//     format: format.combine(
//         format.json(),
//         format.timestamp(),
//         format.metadata(),
//         format.prettyPrint()
//     )
// });

// const cronLogger = createLogger({
//     transports: [
//         new transports.Console(),
//         new transports.MongoDB(mongodbUtilOptions)
//     ],
//     format: format.combine(
//         format.json(),
//         format.timestamp(),
//         format.metadata(),
//         format.prettyPrint()
//     )
// });

// const appLogger = expressWinston.logger({
//     winstonInstance: logger,
//     statusLevels: true
// });

// export { appLogger, logger, cronLogger };


import { transports, format, createLogger } from 'winston';
import 'winston-mongodb';
import * as expressWinston from 'express-winston';

const isProduction = process.env.NODE_ENV === 'production';

const mongodbUri: string = (isProduction ? process.env.MONGO_URI_PROD_LOG : process.env.MONGO_URI_DEV_LOG) ?? "mongodb://localhost:27017";

const mongodbLogOptions = {
    db: mongodbUri,
    collection: 'logs',
};

const mongodbUtilOptions = {
    db: mongodbUri,
    collection: 'util-logs',
};

let mongoTransport;
try {
    mongoTransport = new transports.MongoDB(mongodbLogOptions);
} catch (error) {
    console.error("Error connecting to MongoDB for logs:", error);
    mongoTransport = new transports.Console();
}

let mongoUtilTransport;
try {
    mongoUtilTransport = new transports.MongoDB(mongodbUtilOptions);
} catch (error) {
    console.error("Error connecting to MongoDB for util logs:", error);
    mongoUtilTransport = new transports.Console();
}

const logger = createLogger({
    transports: [
        new transports.Console(),
        mongoTransport
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
        ...(isProduction ? [] : [format.prettyPrint()]) // Corrected conditional pretty print
    )
});

const cronLogger = createLogger({
    transports: [
        new transports.Console(),
        mongoUtilTransport
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
        ...(isProduction ? [] : [format.prettyPrint()]) // Corrected conditional pretty print
    )
});

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

const appLogger = expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true
});

export { appLogger, logger, cronLogger };