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

## ROUTES

GET /api/broadcast

> broadcast message to whatsapp and viber
