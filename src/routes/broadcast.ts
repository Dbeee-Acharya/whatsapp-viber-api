import { Hono } from "hono";
import { broadcastQueue } from "../queue/broadcastQueue.js";
import {
  getLatestSocialNews,
  getNextUnsentNews,
} from "../services/ekantipur.js";
import type { News } from "../types/news.js";

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

  if (unsentNews === null) {
    return c.json({ success: false, message: "No unsent news found" }, 404);
  }

  const delay = getRandomDelay();
  const scheduledAt = new Date(Date.now() + delay);

  const job = await broadcastQueue.add(
    "broadcast-news",
    {
      news: unsentNews,
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

export default broadcastRoute;
