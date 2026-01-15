import { Hono } from "hono";
import {
  getLatestSocialNews,
  getNextUnsentNews,
} from "../services/ekantipur.js";
import { generateNewsImage } from "../services/canvasService.js";
import type { News } from "../types/news.js";
import { whatsappService } from "../services/whatsappService.js";
import config from "../config/config.js";
import { viberService } from "../services/viberService.js";
import { logger } from "../utils/logger.js";

const broadcastRoute = new Hono();

broadcastRoute.get("/", async () => {
  const newsList: Array<News> = await getLatestSocialNews();
  const unsentNews: News | null = await getNextUnsentNews(newsList);

  if (unsentNews === null) {
    console.error("No Unsent news found");
    return;
  }

  const imageBuffer = await generateNewsImage(unsentNews.title);
  const base64Image = imageBuffer.toString("base64");
  const bullets = unsentNews.summary
    .split("।")
    .filter((s) => s.trim())
    .map((s, _i) => `- ${s.trim()}।`)
    .join("\n");

  const caption = `*What you should know:*\n${bullets}\nFull Story: ${unsentNews.permalink}`;

  try {
    await whatsappService.sendImage(
      config.EKANTIPUR_CHANNEL_ID,
      undefined,
      base64Image,
      caption,
    );
  } catch (error) {
    logger.error("Cannot send news to whatsapp", error);
  }

  try {
    await viberService.publishImage(
      config.VIBER_ADMIN_ID,
      base64Image,
      caption,
    );
  } catch (error) {
    logger.error("Cannot send news to viber", error);
  }
});

export default broadcastRoute;
