import { Worker } from "bullmq";
import config from "../config/config.js";
import { QueueName } from "../constants/queue.js";
import { whatsappService } from "../services/whatsappService.js";
import { logger } from "../utils/logger.js";
import type { BusinessNews } from "../types/news.js";

export const marketsWorker = new Worker(
    QueueName.markets,
    async (job) => {
        const news: BusinessNews = job.data.news;

        const caption = `*${news.title}*\n\n${news.deck}\n\nFull Story: ${news.url}`;

        try {
            await whatsappService.sendImage(
                config.EKANTIPUR_MARKETS_CHANNEL_ID,
                news.thumb_path,
                undefined,
                caption,
            );
        } catch (error) {
            logger.error("Cannot send business news to whatsapp", error);
            throw error;
        }

        return { success: true, message: "Business news broadcast sent", newsId: news.news_id };
    },
    {
        connection: {
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            password: (config.REDIS_PASSWORD as string) || undefined,
        },
    },
);

marketsWorker.on("completed", (job) => {
    logger.info(`Markets broadcast job ${job.id} completed`);
});

marketsWorker.on("failed", (job, err) => {
    logger.error(`Markets broadcast job ${job?.id} failed:`, err);
});
