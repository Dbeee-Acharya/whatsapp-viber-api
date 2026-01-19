import { Hono } from "hono";
import { broadcastQueue } from "../queue/broadcastQueue.js";
import {
  getLatestSocialNews,
  getNextUnsentNews,
} from "../services/ekantipur.js";
import type { News } from "../types/news.js";
import { whatsappService } from "../services/whatsappService.js";
import config from "../config/config.js";
import {
  loadExistingMetalPrices,
  updatePrices,
} from "../services/goldSilverScraper.js";

const broadcastRoute = new Hono();

// Random delay between 5-30 minutes in milliseconds
const getRandomDelay = () => {
  const minDelay = 5 * 60 * 1000; // 5 minutes
  const maxDelay = 30 * 60 * 1000; // 30 minutes
  return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
};

broadcastRoute.get("/", async (c) => {
  const newsList: Array<News> = await getLatestSocialNews();
  const unsentNews: News | null = await getNextUnsentNews(newsList);
  const { sendTemplate } = c.req.query();

  if (unsentNews === null) {
    return c.json({ success: false, message: "No unsent news found" }, 404);
  }

  const delay = getRandomDelay();
  const scheduledAt = new Date(Date.now() + delay);

  const job = await broadcastQueue.add(
    "broadcast-news",
    {
      news: unsentNews,
      sendTemplate: sendTemplate,
      removeOnComplete: true,
      removeOnFail: 10,
    },
    {
      delay,
      jobId: `broadcast-${unsentNews.id}`,
    },
  );

  return c.json({
    success: true,
    message: "Broadcast scheduled",
    jobId: job.id,
    newsId: unsentNews.id,
    scheduledAt: scheduledAt.toISOString(),
    delayMinutes: Math.round(delay / 60000),
  });
});

broadcastRoute.get("/send-metal-price", async (c) => {
  try {
    await updatePrices();
    const prices = loadExistingMetalPrices();

    const todayDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const getChangeText = (current: number | null, previous: number | null) => {
      if (current === null || previous === null || current === previous) {
        return "remained same";
      }
      const diff = current - previous;
      const status = diff > 0 ? "gained" : "lost";
      return `${status} NPR ${Math.abs(diff)} in value`;
    };

    const goldChange = getChangeText(prices.gold.today, prices.gold.yesterday);
    const silverChange = getChangeText(
      prices.silver.today,
      prices.silver.yesterday,
    );

    let summary = "";
    if (goldChange === "remained same" && silverChange === "remained same") {
      summary = "price has remained same from yesterday.";
    } else {
      summary = `Gold has ${goldChange} and Silver has ${silverChange}.`;
    }

    const message = `Here are the latest gold and silver rates for ${todayDate}:

Gold: NPR ${prices.gold.today?.toFixed(2)} per tola
Silver: NPR ${prices.silver.today?.toFixed(2)} per tola

${summary}`;

    await whatsappService.sendText(config.EKANTIPUR_MARKETS_CHANNEL_ID, message);

    return c.json({
      success: true,
      message: "Metal price broadcast sent",
      data: {
        message,
        prices,
      },
    });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default broadcastRoute;
