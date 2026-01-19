import { Queue } from "bullmq";
import config from "../config/config.js";
import { QueueName } from "../constants/queue.js";

export const marketsQueue = new Queue(QueueName.markets, {
    connection: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: (config.REDIS_PASSWORD as string) || undefined,
    },
});
