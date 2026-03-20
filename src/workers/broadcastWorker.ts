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
  async (job) => {
    let unsentNews: News | null = job.data?.news;
    let sendTemplate = job.data?.sendTemplate;

    if (!unsentNews) {
      const newsList: Array<News> = await getLatestSocialNews();
      unsentNews = await getNextUnsentNews(newsList);
    }

    if (unsentNews === null) {
      console.error("No news found to broadcast");
      return { success: false, message: "No news found" };
    }

    let imageBuffer;
    let base64Image;
    let imageUrl;

    if (sendTemplate == "true") {
      imageBuffer = await generateNewsImage(unsentNews.title);
      base64Image = imageBuffer.toString("base64");
    } else {
      imageUrl = unsentNews.thumb_path;
    }

    let bullets: string = "";

    // Use hyphen bullets only for ai_summary (when it exists and has non-empty items)
    if (
      Array.isArray(unsentNews.ai_summary) &&
      unsentNews.ai_summary.length > 0 &&
      unsentNews.ai_summary.some((s) => s?.trim())
    ) {
      bullets = unsentNews.ai_summary
        .map((summary) => summary?.trim())
        .filter(Boolean)
        .map((summary) => `- ${summary}`)
        .join("\n");
    } else if (unsentNews.summary?.trim()) {
      // summary is already plain text; do not add "-" bullets
      bullets = unsentNews.summary.trim();
    }

    let caption: string = "";
    if (sendTemplate == "true") {
      caption = `*What you should know:*\n${bullets}\n\nFull Story: ${unsentNews.permalink}`;
    } else {
      caption = `*${unsentNews.title}*\n\n${bullets}\n\nFull Story: ${unsentNews.permalink}`;
    }

    try {
      if (sendTemplate === "true") {
        await whatsappService.sendImage(
          config.EKANTIPUR_CHANNEL_ID,
          undefined,
          base64Image,
          caption,
        );
      } else {
        await whatsappService.sendImage(
          config.EKANTIPUR_CHANNEL_ID,
          imageUrl,
          undefined,
          caption,
        );
      }
    } catch (error) {
      logger.error("Cannot send news to whatsapp", error);
      throw error;
    }

    return { success: true, message: "Broadcast sent", newsId: unsentNews.id };
  },
  {
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: (config.REDIS_PASSWORD as string) || undefined,
    },
  },
);

broadcastWorker.on("completed", (job) => {
  logger.info(`Broadcast job ${job.id} completed`);
});

broadcastWorker.on("failed", (job, err) => {
  logger.error(`Broadcast job ${job?.id} failed:`, err);
});
