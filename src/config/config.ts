interface Config {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  [key: string]: string | number;
}

const config: Config = {
  // server config
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV:
    (process.env.NODE_ENV as "development" | "production" | "test") ||
    "development",
};

export default config;
