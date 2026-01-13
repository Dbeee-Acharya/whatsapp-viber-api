import { createCanvas, loadImage, registerFont } from "canvas";
import type { CanvasRenderingContext2D } from "canvas";
import fs from "fs";

const WIDTH = 1080;
const HEIGHT = 1080;
const PADDING = 120;
const LINE_HEIGHT = 80;
const MAX_TEXT_WIDTH = WIDTH - PADDING * 2;

// Register Nepali font
registerFont("../assets/fonts/Mukta-Regular.ttf", {
  family: "Kalimati",
});

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine + word + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine !== "") {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

export async function generateNewsImage(text: string) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Text style
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px Kalimati";
  ctx.textAlign = "left";

  const lines = wrapText(ctx, text, MAX_TEXT_WIDTH);

  let y = HEIGHT / 2 - (lines.length * LINE_HEIGHT) / 2;

  for (const line of lines) {
    ctx.fillText(line, PADDING, y);
    y += LINE_HEIGHT;
  }

  // Optional logo
  const logo = await loadImage("../assets/ekantipur-logo.png");
  ctx.drawImage(logo, 80, HEIGHT - 160, 80, 80);

  fs.writeFileSync("output.png", canvas.toBuffer("image/png"));
}
