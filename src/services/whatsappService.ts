import { wahaClient } from "../lib/waha.js";
import config from "../config/config.js";

export const whatsappService = {
  async sendText(chatId: string, text: string) {
    const payload = {
      chatId: chatId,
      text: text,
      session: config.WAHA_SESSION,
    };
    return await wahaClient.post("/api/sendText", payload);
  },
  async sendImage(
    chatId: string,
    imageUrl?: string,
    fileData?: string,
    caption?: string,
  ) {
    const filename = `myFile_${new Date()
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14)}.png`;

    const payload = {
      chatId: chatId,
      session: config.WAHA_SESSION,
      file: imageUrl
        ? {
            url: imageUrl,
            mimetype: "image/png",
            filename,
          }
        : {
            data: fileData,
            mimetype: "image/png",
            filename,
          },
      caption: caption || "", //either a caption or empty string for the case of no captions
    };

    console.log(payload);
    return await wahaClient.post("/api/sendImage", payload);
  },
};
