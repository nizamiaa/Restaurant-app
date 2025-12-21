# Restaurant Backend

Simple Express backend for local development.

Run locally:

```bash
cd "Restaurant Web App/backend"
npm install
npm start
```

Available endpoints:

- `GET /api/menu` — list menu items
- `POST /api/auth/login` — body: `{ "username": "admin|user", "password": "admin|user" }`
- `POST /api/orders` — create order (returns order with `id` and `status`)
