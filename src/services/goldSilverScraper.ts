import * as cheerio from "cheerio";
import fs from "fs";
import type { MetalPriceData } from "../types/goldSilver.js";
import config from "../config/config.js";
import axios from "axios";

const FENEGOSIDA_URL = "https://fenegosida.org";

const FETCH_TIMEOUT_MS = 10_000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2_000; // 2 seconds between retries

const SANITY = {
  gold: { min: 100_000, max: 1_000_000 },
  silver: { min: 1_000, max: 50_000 },
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await axios.get<string>(url, {
        timeout: FETCH_TIMEOUT_MS,
        family: 4, // force IPv4
      });
      return res.data;
    } catch (err) {
      lastError = err;
      if (attempt === MAX_RETRIES) break;
      console.warn(
        `Fetch attempt ${attempt}/${MAX_RETRIES} failed: ${err}. Retrying in ${RETRY_DELAY_MS}ms...`,
      );
      await sleep(RETRY_DELAY_MS);
    }
  }

  throw new Error(
    `Failed to fetch ${url} after ${MAX_RETRIES} attempts: ${lastError}`,
  );
}

function extractTolaRates(html: string): {
  gold: number | null;
  silver: number | null;
} {
  const $ = cheerio.load(html);
  let gold: number | null = null;
  let silver: number | null = null;

  // eq(1) = second div in #vtab, which is the "per tola" section (eq(0) is "per 10 grm")
  const tolaSection = $("#vtab > div").eq(1);

  tolaSection.find(".rate-gold, .rate-silver").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();

    if (text.includes("FINE GOLD")) {
      const matches = text.match(/\d+(?:\.\d+)?/g);
      if (matches) {
        const value = parseFloat(matches[matches.length - 1]);
        if (!isNaN(value)) gold = value;
      }
    }

    if (text.includes("SILVER")) {
      const matches = text.match(/\d+(?:\.\d+)?/g);
      if (matches) {
        const value = parseFloat(matches[matches.length - 1]);
        if (!isNaN(value)) silver = value;
      }
    }
  });

  return { gold, silver };
}

function validatePrices(gold: number, silver: number): void {
  if (gold < SANITY.gold.min || gold > SANITY.gold.max) {
    throw new Error(
      `Gold price ${gold} is outside expected range (${SANITY.gold.min}–${SANITY.gold.max})`,
    );
  }
  if (silver < SANITY.silver.min || silver > SANITY.silver.max) {
    throw new Error(
      `Silver price ${silver} is outside expected range (${SANITY.silver.min}–${SANITY.silver.max})`,
    );
  }
}

export function loadExistingMetalPrices(): MetalPriceData {
  if (!fs.existsSync(config.METAL_PRICE_STORAGE_FILE_PATH)) {
    return {
      gold: { yesterday: null, today: null },
      silver: { yesterday: null, today: null },
    };
  }

  try {
    return JSON.parse(
      fs.readFileSync(config.METAL_PRICE_STORAGE_FILE_PATH, "utf8"),
    );
  } catch (err) {
    throw new Error(`Failed to read/parse price storage file: ${err}`);
  }
}

export async function updatePrices(): Promise<{
  latestGoldPrice: number;
  latestSilverPrice: number;
}> {
  const html = await fetchWithRetry(FENEGOSIDA_URL);

  const latest = extractTolaRates(html);

  if (latest.gold === null || latest.silver === null) {
    throw new Error(
      `Failed to extract prices from HTML (gold=${latest.gold}, silver=${latest.silver})`,
    );
  }

  validatePrices(latest.gold, latest.silver);

  const existing = loadExistingMetalPrices();

  // GOLD — only rotate yesterday/today when the price actually changes
  if (existing.gold.today !== latest.gold) {
    existing.gold.yesterday = existing.gold.today;
    existing.gold.today = latest.gold;
  }

  // SILVER
  if (existing.silver.today !== latest.silver) {
    existing.silver.yesterday = existing.silver.today;
    existing.silver.today = latest.silver;
  }

  try {
    fs.writeFileSync(
      config.METAL_PRICE_STORAGE_FILE_PATH,
      JSON.stringify(existing, null, 2),
    );
  } catch (err) {
    throw new Error(`Failed to write price storage file: ${err}`);
  }

  console.log(
    `Prices updated — gold: ${existing.gold.today}, silver: ${existing.silver.today}`,
  );

  // Always return the current stored price, never 0
  return {
    latestGoldPrice: existing.gold.today ?? 0,
    latestSilverPrice: existing.silver.today ?? 0,
  };
}
