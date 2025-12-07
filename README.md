# alakh_mart_frontend

This repository is a feature-rich frontend scaffold for a large-scale e-commerce application similar to Amazon.

Features:
- Next.js + TypeScript
- Tailwind CSS
- Zustand for state management
- Mock API for dev and UI testing
- Payment simulator: create intents and confirm them for demo

Webhook simulation
------------------
For demo/testing: set the environment variable `WEBHOOK_SECRET` to secure the webhook endpoint (defaults to `demo-secret`).
Use the admin page `/admin/payments` to simulate payment provider webhooks by entering an intent id.

Data persistence
----------------
This scaffold uses file-based persistence (in `data/`) for demo purposes: `orders.json` and `intents.json` store orders and payment intents respectively. This is fine for local development, but for production use a real database (Postgres, MySQL, MongoDB, etc.).

To reset the demo data, delete or truncate the files in `data/`.

Prisma (SQLite) migration
-------------------------
This repository now includes a `prisma` schema to store data using SQLite. To initialize and use Prisma locally:

1. Install dependencies:

```bash
npm install
```

2. Set the database URL in `.env` (create it in repo root):

```
DATABASE_URL="file:./dev.db"
```

3. Generate Prisma client and run migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will create `dev.db` in the repo root. The APIs will use Prisma to persist orders and payment intents.