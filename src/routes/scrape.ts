import { Hono } from "hono";
import { updatePrices } from "../services/goldSilverScraper.js";
import { logger } from "../utils/logger.js";

const scrapeRoute = new Hono();

scrapeRoute.get("/metal-price", async (c) => {
  try {
    await updatePrices();
    return c.json({ success: true, message: "Metal prices updated successfully" });
  } catch (e) {
    logger.error(e);
    return c.json({ success: false, message: "Error getting latest gold and silver price" }, 500);
  }
});

export default scrapeRoute;
