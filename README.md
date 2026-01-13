# KMG Whatsapp-Viber broadcast service

---

## To Install and build

```bash
pnpm install --frozen-lockfile
pnpm build
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
