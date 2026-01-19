import { Hono } from "hono";
import { updatePrices } from "../services/goldSilverScraper.js";
import { logger } from "../utils/logger.js";

const scrapeRoute = new Hono();

scrapeRoute.get("/metal-price", async (c) => {
  try {
    await updatePrices();
  } catch (e) {
    logger.error(e);
    throw new Error("Error getting latest gold and silver price");
  }
});
