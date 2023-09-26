"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.connect = void 0;
const ioredis_1 = require("ioredis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let redisInstance = null;
function connect() {
    if (!redisInstance) {
        redisInstance = new ioredis_1.default({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
        });
    }
    return redisInstance;
}
exports.connect = connect;
function close() {
    if (redisInstance) {
        redisInstance.quit();
        redisInstance = null;
    }
}
exports.close = close;
//# sourceMappingURL=redis_helper.js.map