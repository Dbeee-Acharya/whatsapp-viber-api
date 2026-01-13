import { Hono } from "hono";

const broadcastRoute = new Hono();

broadcastRoute.get("/", async (c) => {});

export default broadcastRoute;
