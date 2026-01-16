interface Config {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";

  //whatsapp using WAHA
  WAHA_BASE_URL: string;
  WAHA_SESSION: string;
  WAHA_WEBHOOK_AUTH: string;
  WAHA_API_KEY: string;

  // viber
  VIBER_API_URL: string;
  VIBER_API_KEY: string;
  BOT_NAME: string;
  VIBER_ADMIN_ID: string;

  //ekantipur
  EKANTIPUR_BASE_URL: string;
  EKANTIPUR_CHANNEL_ID: string;
  EKANTIPUR_MARKETS_CHANNEL_ID: string;

  //storage
  METAL_PRICE_STORAGE_FILE_PATH: string;
  SENT_NEWS_ID_STORAGE_FILE_PATH: string;

  //redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;

  //wildcard
  [key: string]: string | number;
}

const config: Config = {
  // server config
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV:
    (process.env.NODE_ENV as "development" | "production" | "test") ||
    "development",

  //waha
  WAHA_BASE_URL: process.env.WAHA_BASE_URL || "",
  WAHA_SESSION: process.env.WAHA_SESSION || "",
  WAHA_WEBHOOK_AUTH: process.env.WAHA_WEBHOOK_AUTH || "",
  WAHA_API_KEY: process.env.WAHA_API_KEY || "",

  // viber
  VIBER_API_URL: process.env.VIBER_API_URL || "",
  VIBER_API_KEY: process.env.VIBER_API_KEY || "",
  VIBER_ADMIN_ID: process.env.VIBER_ADMIN_ID || "",
  BOT_NAME: process.env.BOT_NAME || "KMG",

  //ekantipur
  EKANTIPUR_BASE_URL: process.env.EKANTIPUR_BASE_URL || "",
  EKANTIPUR_CHANNEL_ID: process.env.EKANTIPUR_CHANNEL_ID || "",
  EKANTIPUR_MARKETS_CHANNEL_ID: process.env.EKANTIPUR_MARKETS_CHANNEL_ID || "",

  //storage
  SENT_NEWS_ID_STORAGE_FILE_PATH:
    process.env.SENT_NEWS_ID_STORAGE_FILE_PATH || "",
  METAL_PRICE_STORAGE_FILE_PATH:
    process.env.METAL_PRICE_STORAGE_FILE_PATH || "",

  //redis
  REDIS_HOST: process.env.REDIS_HOST || "",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379"),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
};

export default config;
