import config from "../config/config.js";
import { createInstance } from "./axios.js";

export const viberClient = createInstance(config.VIBER_API_URL, {
  'X-Viber-Auth-Token': config.VIBER_API_KEY
});
