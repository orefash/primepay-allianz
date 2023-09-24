import Redis from 'ioredis';
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

let redisInstance: any = null;

function connect(): any {
    if (!redisInstance) {
        redisInstance = new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || '6379'), // Default to port 6379 if not provided
            password: process.env.REDIS_PASSWORD,
        });
    }
    return redisInstance;
}

function close() {
    if (redisInstance) {
        redisInstance.quit();
        redisInstance = null;
    }
}

export { connect, close };
