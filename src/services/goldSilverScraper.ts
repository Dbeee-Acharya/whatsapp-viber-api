import * as cheerio from "cheerio";
import fs from "fs";
import type { MetalPriceData } from "../types/goldSilver.js";
import config from "../config/config.js";

const URL = "https://www.fenegosida.org";

function extractTolaRates(html: string) {
  const $ = cheerio.load(html);

  let gold: number | null = null;
  let silver: number | null = null;

  const tolaSection = $("#vtab > div").eq(1);

  tolaSection.find(".rate-gold, .rate-silver").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ");

    if (text.includes("FINE GOLD")) {
      gold = Number(text.match(/(\d{3,})/)?.[1]);
    }
    if (text.includes("SILVER")) {
      gold = Number(text.match(/(\d{3,})/)?.[1]);
    }
  });

  return { gold, silver };
}

function loadExisting(): MetalPriceData {
  if (!fs.existsSync(config.METAL_PRICE_STORAGE_FILE_PATH)) {
    return {
      gold: { yesterday: null, today: null },
      silver: { yesterday: null, today: null },
    };
  }

  return JSON.parse(
    fs.readFileSync(config.METAL_PRICE_STORAGE_FILE_PATH, "utf8"),
  );
}

export async function updatePrices() {
  const res = await fetch(URL);
  const html = await res.text();

  const latest = extractTolaRates(html);
  if (!latest.gold || !latest.silver) {
    throw new Error("Failed to extract prices");
  }

  let latestGoldPrice = 0;
  let latestSilverPrice = 0;

  const existing = loadExisting();

  // GOLD
  if (existing.gold.today !== latest.gold) {
    existing.gold.yesterday = existing.gold.today;
    existing.gold.today = latest.gold;
    latestGoldPrice = latest.gold;
  }

  // SILVER
  if (existing.silver.today !== latest.silver) {
    existing.silver.yesterday = existing.silver.today;
    existing.silver.today = latest.silver;
    latestSilverPrice = latest.silver;
  }

  fs.writeFileSync(
    config.METAL_PRICE_STORAGE_FILE_PATH,
    JSON.stringify(existing, null, 2),
  );
  console.log("Prices updated");

  return { latestGoldPrice, latestSilverPrice };
}

updatePrices().catch(console.error);
