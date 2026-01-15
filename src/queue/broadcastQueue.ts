import { Queue } from "bullmq";
import config from "../config/config.js";
import { QueueName } from "../constants/queue.js";

export const broadcastQueue = new Queue(QueueName.broadcast, {
    connection: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSSWORD || undefined,
    },
});
