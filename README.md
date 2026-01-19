# KMG Whatsapp-Viber broadcast service

---

## To Install and build

```bash
pnpm install --frozen-lockfile
pnpm build
```

> You might need to install other dependencies for node-canvas to generate image

```bash
sudo apt install -y libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev

```

---

## To start pm2 process

```bash
pm2 start ecosystem.config.cjs
```

---

## FEATURES

- **News Broadcast**: Automatically broadcasts social news with optional AI-generated image templates.
- **Metal Prices**: Scrapes FENEGOSIDA for latest gold and silver rates and broadcasts them.
- **Business News**: Scans for the latest business/market news and queues them for broadcast with random delays.
- **Queue Management**: Uses BullMQ for reliable message delivery and scheduling.

---

## ROUTES

### Social News
- `GET /api/broadcast`: Broadcast latest social news.
- `GET /api/broadcast?sendTemplate=true`: Broadcast with an AI-generated image template.

### Metal Prices
- `GET /api/broadcast/send-metal-price`: Broadcast latest gold and silver rates with a comparison to yesterday's prices.

### Business News
- `GET /api/broadcast/send-business-news`: Checks for all unsent business news and adds them to the markets queue with a random 5-10 minute delay.

### Scraping
- `GET /api/scrape/metal-price`: Manually trigger a scrape to update the local gold and silver price data.
