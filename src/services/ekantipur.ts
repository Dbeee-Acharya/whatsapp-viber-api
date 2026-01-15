import config from "../config/config.js";
import URLS from "../constants/urls.js";
import { createInstance } from "../lib/axios.js";
import type { News } from "../types/news.js";
import fs from "fs/promises";
import { logger } from "../utils/logger.js";

const ekantipurApi = createInstance(config.EKANTIPUR_BASE_URL);

export async function getLatestSocialNews(): Promise<Array<News>> {
  const res = await ekantipurApi.get(URLS.ekantipur.getLatestSocilNews);

  const news: Array<News> = res.data?.data;

  return news;
}

export async function getNextUnsentNews(
  news: Array<News>,
): Promise<News | null> {
  let sentIds: number[] = [];

  try {
    const data = await fs.readFile(
      config.SENT_NEWS_ID_STORAGE_FILE_PATH,
      "utf8",
    );
    sentIds = JSON.parse(data);
  } catch (err) {
    logger.warn("news ID file doesn't exist, starting fresh");
    sentIds = [];
  }

  const sentSet = new Set(sentIds);

  // Sort news by pub_date descending
  const sortedNews = [...news].sort(
    (a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime(),
  );

  const nextUnsent = sortedNews.find((n) => !sentSet.has(n.id));

  if (!nextUnsent) return null; // all news sent

  const updatedIds = [
    nextUnsent.id,
    ...sentIds.filter((id) => id !== nextUnsent.id),
  ].slice(0, 25);

  await fs.writeFile(
    config.SENT_NEWS_ID_STORAGE_FILE_PATH,
    JSON.stringify(updatedIds, null, 2),
    "utf8",
  );

  return nextUnsent;
}
