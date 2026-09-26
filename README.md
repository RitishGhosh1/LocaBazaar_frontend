# LocaBazaar Frontend

LocaBazaar is a local-services marketplace where customers discover and book nearby providers. This repository contains the responsive Next.js web application.

**Live application:** [loca-bazaar-frontend.vercel.app](https://loca-bazaar-frontend.vercel.app/)

**Backend API:** [Swagger documentation](https://locabazaar-ritish.duckdns.org/docs) · [API base URL](https://locabazaar-ritish.duckdns.org/api/v1)

## What it includes

- Browse and search local services by category and location.
- Customer registration, sign-in, profile management, and bookings.
- Provider onboarding, service listings, image uploads, and booking management.
- Service ratings and reviews.
- Administrator dashboards for platform moderation.
- Responsive light and dark themes.

## Built with

Next.js App Router, React, TypeScript, Tailwind CSS, TanStack Query, Zustand, and Axios.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
git clone https://github.com/RitishGhosh1/LocaBazaar_frontend.git
cd LocaBazaar_frontend
npm install
```

Create `.env.local` with the local backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Start the development server:

```bash
npm run dev
```

Open <http://localhost:3000>. The backend must also be running; see the [backend repository](https://github.com/RitishGhosh1/LocaBazaar) for Docker Compose setup.

## Deploy on Vercel

Connect this repository to Vercel and add this project environment variable for the environments you deploy:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://locabazaar-ritish.duckdns.org/api/v1` |

This URL is included in browser code, so it is public configuration rather than a secret. Set the backend CORS allowlist to the exact Vercel origin. After changing the variable, create a new deployment so Next.js rebuilds with the updated value.

## Build and lint

```bash
npm run build
npm run lint
```

## Project layout

```text
src/
├── app/         # Pages and layouts (explore, service, customer, provider, admin)
├── components/  # Shared UI and feature components
├── hooks/       # Query and application hooks
├── services/    # API client and typed endpoint helpers
└── store/       # Client-side state
```
