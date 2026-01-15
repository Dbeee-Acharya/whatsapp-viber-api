import { Worker } from "bullmq";
import config from "../config/config.js";
import { QueueName } from "../constants/queue.js";
import {
    getLatestSocialNews,
    getNextUnsentNews,
} from "../services/ekantipur.js";
import { generateNewsImage } from "../services/canvasService.js";
import type { News } from "../types/news.js";
import { whatsappService } from "../services/whatsappService.js";
import { logger } from "../utils/logger.js";

export const broadcastWorker = new Worker(
    QueueName.broadcast,
    async (_job) => {
        const newsList: Array<News> = await getLatestSocialNews();
        const unsentNews: News | null = await getNextUnsentNews(newsList);

        if (unsentNews === null) {
            console.error("No Unsent news found");
            return { success: false, message: "No unsent news found" };
        }

        const imageBuffer = await generateNewsImage(unsentNews.title);
        const base64Image = imageBuffer.toString("base64");
        const bullets = unsentNews.summary
            .split("।")
            .filter((s) => s.trim())
            .map((s, _i) => `- ${s.trim()}।`)
            .join("\n");

        const caption = `*What you should know:*\n\n${bullets}\n\nFull Story: ${unsentNews.permalink}`;

        try {
            await whatsappService.sendImage(
                config.EKANTIPUR_CHANNEL_ID,
                undefined,
                base64Image,
                caption,
            );
        } catch (error) {
            logger.error("Cannot send news to whatsapp", error);
            throw error;
        }

        return { success: true, message: "Broadcast sent" };
    },
    {
        connection: {
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            password: config.REDIS_PASSSWORD || undefined,
        },
    },
);

broadcastWorker.on("completed", (job) => {
    logger.info(`Broadcast job ${job.id} completed`);
});

broadcastWorker.on("failed", (job, err) => {
    logger.error(`Broadcast job ${job?.id} failed:`, err);
});
