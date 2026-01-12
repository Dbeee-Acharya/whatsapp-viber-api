import config from "../config/config.js";
import { createInstance } from "./axios.js";

// We initialize the specific WAHA client here
export const wahaClient = createInstance(config.WAHA_BASE_URL as string, {
  "X-api-key": config.WAHA_API_KEY,
});
