import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import config from "./config/config.js";
import messageRoute from "./routes/sendMessageRoute.js";

const app = new Hono();

app.use('*', async (c,next) =>{
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  await next();
})

app.get("/", (c) => {
  return c.text("Hono Server for BROADCAST is online!");
});

app.route('/api/broadcast', messageRoute);

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
