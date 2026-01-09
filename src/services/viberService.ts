import { viberClient } from "../lib/viber.js";
import config from "../config/config.js";

export const viberService = {
  // async sendText(receiver: string, text: string) {
  //   const payload = {
  //     receiver: receiver,
  //     min_api_version: 1,
  //     sender: { name: config.BOT_NAME },
  //     type: "text",
  //     text: text,
  //   };
  //   return await viberClient.post('/send_text', payload);
  // },
  async publishText(adminId: string, message:string){
    const payload = {
      from: adminId,
      type: "text",
      text: message
    };
    return await viberClient.post('/post', payload);
  },

  async publishImage(adminId: string,imageUrl:string, caption?:string){
    const payload = {
      from: adminId,
      type: "picture",
      media: imageUrl,
      text: caption || '',
    };
    return await viberClient.post('/post', payload);
  }

  // async sendImage(receiver: string, imageUrl: string, caption?: string) {
  //   const payload = {
  //     receiver: receiver,
  //     min_api_version: 1,
  //     sender: { name: config.BOT_NAME },
  //     type: "picture",
  //     media: imageUrl,
  //     text: caption || '',
  //   };
  //   return await viberClient.post('/send_image', payload);
  // }
};
