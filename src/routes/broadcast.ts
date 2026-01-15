import { Hono } from "hono";
import { broadcastQueue } from "../queue/broadcastQueue.js";

const broadcastRoute = new Hono();

// Random delay between 5-30 minutes in milliseconds
const getRandomDelay = () => {
  const minDelay = 5 * 60 * 1000; // 5 minutes
  const maxDelay = 30 * 60 * 1000; // 30 minutes
  return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
};

broadcastRoute.get("/", async (c) => {
  const delay = getRandomDelay();
  const scheduledAt = new Date(Date.now() + delay);

  const job = await broadcastQueue.add(
    "broadcast-news",
    {
      removeOnComplete: true,
      removeOnFail: 10,
    },
    { delay },
  );

  return c.json({
    success: true,
    message: "Broadcast scheduled",
    jobId: job.id,
    scheduledAt: scheduledAt.toISOString(),
    delayMinutes: Math.round(delay / 60000),
  });
});

export default broadcastRoute;
