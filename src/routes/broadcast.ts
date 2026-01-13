import { Hono } from "hono";

const broadcastRoute = new Hono();

broadcastRoute.post("/", async (c) => {});

export default broadcastRoute;
