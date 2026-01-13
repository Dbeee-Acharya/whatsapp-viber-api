import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import config from "./config/config.js";
import messageRoute from "./routes/sendMessageRoute.js";
import broadcastRoute from "./routes/broadcast.js";

const app = new Hono();

app.use("*", async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  await next();
});

app.get("/", (c) => {
  return c.text("Hono Server for BROADCAST is online!");
});

app.route("/api/send-message", messageRoute);
app.route("/api/broadcast", broadcastRoute);

serve(
  {
    fetch: app.fetch,
    port: config.PORT,
  },
  (info) => {
    console.log(`Server is running on port: ${info.port}`);
  },
);

export default app;
