# Nawy Apartments

A simple apartment listing app: browse apartments, view details, add new listings with multiple photos, and search/filter/sort the listing page.

## Stack
- **Backend**: Node.js, TypeScript, Express, Prisma ORM
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL
- **Infra**: Docker Compose

## Run it

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Postgres runs internally on the compose network only (not published to the host, to avoid clashing with any local Postgres install). Add a `ports: ["5432:5432"]` mapping under the `postgres` service if you want to connect from the host.

On first boot, the backend runs migrations and seeds 6 sample apartments automatically. Nothing else to configure.

## API

Base URL: `http://localhost:4000/api/apartments`

### `GET /api/apartments`
List apartments, with optional search, filters, sort, and pagination.

| Query param | Type   | Default   | Description                                          |
|-------------|--------|-----------|-------------------------------------------------------|
| `search`    | string | -         | Matches unit name, unit number, or project             |
| `minPrice`  | number | -         | Minimum price                                          |
| `maxPrice`  | number | -         | Maximum price                                          |
| `bedrooms`  | number | -         | Minimum bedrooms (e.g. `3` = "3+")                      |
| `bathrooms` | number | -         | Minimum bathrooms                                       |
| `sort`      | enum   | `newest`  | `newest` \| `price_asc` \| `price_desc`                 |
| `page`      | number | 1         | Page number                                             |
| `limit`     | number | 12        | Page size (max 100)                                     |

```bash
curl "http://localhost:4000/api/apartments?search=palm&minPrice=2000000&bedrooms=2&sort=price_asc&page=1&limit=10"
```
```json
{ "data": [ { "id": "...", "unitName": "Sunrise Loft", ... } ], "total": 6, "page": 1, "limit": 10 }
```

### `GET /api/apartments/:id`
Apartment details. Returns `404` if the id doesn't exist.

```bash
curl http://localhost:4000/api/apartments/<id>
```

### `POST /api/apartments`
Create an apartment. Body is validated (Zod) — `400` with details on failure. Rate-limited to 20 requests per 15 minutes per IP — `429` once exceeded.

```bash
curl -X POST http://localhost:4000/api/apartments \
  -H "Content-Type: application/json" \
  -d '{
    "unitName": "Sunrise Loft",
    "unitNumber": "A-101",
    "project": "Palm Hills",
    "price": 2450000,
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 120,
    "address": "6th of October City, Giza",
    "description": "Bright corner unit with a private garden.",
    "imageUrls": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"]
  }'
```

`imageUrls` accepts up to 6 URLs (the frontend sends base64 `data:` URLs from the drag-and-drop uploader, capped at 2MB per image).

## Local development (without Docker)

Requires a local Postgres instance.

```bash
# backend
cd backend
cp .env.example .env   # point DATABASE_URL at your local postgres
npm install
npx prisma migrate dev
npm run seed
npm run dev             # http://localhost:4000

# frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:3000
```

## Tests

```bash
cd backend
npm test
```
Runs against whatever `DATABASE_URL` is set (points at the docker-compose Postgres by default if it's running). Covers the create-validation, get/404, and search paths — the non-trivial logic in the API.

## Design notes / tradeoffs

- **No service/repository layer in the backend.** A handful of endpoints over one model don't need it — controllers talk to Prisma directly. Would introduce one if the domain logic grew.
- **All data fetching on the frontend is client-side** (`"use client"` components calling `fetch`), not server components. In a single docker-compose deployment, the Next.js server container can't resolve the backend by `localhost`, only the browser can (via the published port). Keeping all fetches client-side means one `NEXT_PUBLIC_API_URL` works for both, instead of maintaining separate internal/external URLs for SSR vs. browser. Trade-off: no SSR data for these pages — acceptable for a small internal-style listing app, not what you'd want for a public SEO-sensitive site.
- **Images are stored as base64 `data:` URLs in Postgres**, not object storage. The drag-and-drop uploader reads files client-side via `FileReader`, caps each at 2MB and 6 per apartment. No S3/Cloudinary integration needed for a demo, but this is not how you'd do it for a real, large-scale catalog — that's the upgrade path if this went to production.
- **Search request race conditions are handled with `AbortController`**: the listing page cancels the in-flight fetch whenever filters/search/page change, so a slow response for an earlier keystroke can never overwrite a newer one.
- **Rate limiting** on `POST /api/apartments` uses `express-rate-limit`'s default in-memory store (20 req/15 min per IP) — fine for a single backend instance; would move to a shared store (Redis) behind a load balancer.
- **Left out on purpose**: authentication, edit/delete endpoints. None of these were required by the assignment; happy to add either.
