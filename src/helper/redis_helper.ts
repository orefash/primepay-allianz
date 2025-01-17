import Redis from 'ioredis';
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

let redisInstance: any = null;

// console.log("Redis: ", process.env.REDIS_HOST)

function connect(): any {
    if (!redisInstance) {
        redisInstance = new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || '6379'), // Default to port 6379 if not provided
            password: process.env.REDIS_PASSWORD,
            retryStrategy(times) {
                // Retry up to 30 times with exponential backoff
                if (times > 30) {
                  return null; // End retrying
                }
                const delay = Math.min(times * 50, 2000); // Delay between 50ms and 2000ms
                return delay;
              },
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
