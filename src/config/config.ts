interface Config {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";

  //whatsapp using WAHA
  WAHA_BASE_URL: string;
  WAHA_SESSION: string;

  // viber
  VIBER_API_URL: string;
  VIBER_API_KEY: string;
  BOT_NAME: string;
  [key: string]: string | number;
}

const config: Config = {
  // server config
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV:
    (process.env.NODE_ENV as "development" | "production" | "test") ||
    "development",

    WAHA_BASE_URL: process.env.WAHA_BASE_URL || '',
    WAHA_SESSION: process.env.WAHA_SESSION || '',
    VIBER_API_URL: process.env.VIBER_API_URL || '',
    VIBER_API_KEY: process.env.VIBER_API_KEY || '',
    BOT_NAME: "KMG",
};

export default config;
