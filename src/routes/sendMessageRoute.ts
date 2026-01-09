import { Hono } from "hono";
import { whatsappService } from "../services/whatsappService.js";
import { viberService } from "../services/viberService.js";

const messageRoute = new Hono();

interface BroadcastRequest {
  type: 'text' | 'image';
  whatsappGroup?: string;  //  Chat ID
  viberAdminId?: string;   //  Admin ID for the Viber Channel
  content: string;         // The text or the image URL
  caption?: string;        // optional caption for images ?
}

messageRoute.post('/', async (c) => {
  const body = await c.req.json<BroadcastRequest>();
  const { type, whatsappGroup, viberAdminId, content, caption } = body;

  if (!content) return c.json({ error: "Content is required" }, 400);
  if (!whatsappGroup && !viberAdminId) {
    return c.json({ error: "At least one destination (whatsappGroup or viberAdminId) is required" }, 400);
  }

  try {
    const tasks: Promise<{ platform: string; status: string; data?: any; error?: any }>[] = [];

    if (whatsappGroup) {
      const task = type === 'image'
        ? whatsappService.sendImage(whatsappGroup, content, caption)
        : whatsappService.sendText(whatsappGroup, content);

      tasks.push(
        task
          .then(res => ({ platform: 'whatsapp', status: 'success', data: res.data }))
          .catch(err => ({
            platform: 'whatsapp',
            status: 'failed',
            error: err?.response?.data || err?.message || 'Unknown error'
          }))
      );
    }

    if (viberAdminId) {
      const task = type === 'image'
        ? viberService.publishImage(viberAdminId, content, caption)
        : viberService.publishText(viberAdminId, content);

      tasks.push(
        task
          .then(res => ({ platform: 'viber', status: 'success', data: res.data }))
          .catch(err => ({
            platform: 'viber',
            status: 'failed',
            error: err?.response?.data || err?.message || 'Unknown error'
          }))
      );
    }

    const results = await Promise.all(tasks);

    return c.json({
      message: "Broadcast process completed",
      results: results
    });

  } catch (globalError: any) {
    return c.json({ error: "Broadcast system failed", details: globalError.message }, 500);
  }
});

export default messageRoute;
