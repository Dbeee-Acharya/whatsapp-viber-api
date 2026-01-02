
import { Hono } from "hono";
import { whatsappService } from "../services/whatsappService.js";
import { viberService } from "../services/viberService.js";

const messageRoute = new Hono();

messageRoute.post('/', async (c) => {
  const body = await c.req.json();
  const { type, whatsappGroup, viberGroup, content, caption } = body;

  if (!content) return c.json({ error: "Content is required" }, 400);
  if (!whatsappGroup && !viberGroup) {
    return c.json({ error: "At least one destination is required" }, 400);
  }

  try {
    const tasks: Promise<{ platform: string; status: string; data?: any }>[] = [];

    if (whatsappGroup) {
      const task = type === 'image'
        ? whatsappService.sendImage(whatsappGroup, content, caption)
        : whatsappService.sendText(whatsappGroup, content);
      tasks.push(
        task.then(res => ({ platform: 'whatsapp', status: 'success', data: res.data }))
            .catch(err => ({ platform: 'whatsapp', status: 'failed', error: err?.response?.data || err?.message || 'Unknown error' }))
      );
    }

    if (viberGroup) {
      const task = type === 'image'
        ? viberService.sendImage(viberGroup, content, caption)
        : viberService.sendText(viberGroup, content);
      tasks.push(
        task.then(res => ({ platform: 'viber', status: 'success', data: res.data }))
            .catch(err => ({ platform: 'viber', status: 'failed', error: err?.response?.data || err?.message || 'Unknown error' }))
      );
    }

    const results = await Promise.all(tasks);

    return c.json({
      message: "Message SENT",
      results: results
    });

  } catch (globalError: any) {
    return c.json({ error: "Broadcast system failed", details: globalError.message }, 500);
  }
});

export default messageRoute;
