# Skydecor Admin Dashboard

A full-stack admin panel for managing the Skydecor interior decor business — lead collection, event management, showroom tracking, blog/product/SEO content, and analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Bootstrap 5, Zustand |
| Backend | Node.js, Express 5, MongoDB (Mongoose) |
| Auth | JWT (httpOnly cookies) |
| Charts | ApexCharts |
| Export | Excel (XLSX) |

---

## Project Structure

```
startup/
├── backend/          # Express REST API
│   └── src/
│       ├── config/   # DB connection, env validation
│       ├── controller/
│       ├── middleware/  # JWT auth, rate limiting, validation
│       ├── model/    # Mongoose schemas (Lead, User)
│       ├── routes/   # lead, auth, admin, api routes
│       └── utils/    # Excel export helpers
└── frontend/         # React + Vite SPA
    └── src/
        ├── app/      # Page components (Next.js-style file routing)
        ├── components/
        ├── context/  # Auth, layout, notifications
        ├── store/    # Zustand stores
        └── routes/   # React Router config
```

---

## Features

- **Lead Management** — Collect and view leads from events, showrooms, website contact forms, product enquiries, and job applications. Export any lead set to Excel.
- **Event Management** — Create and manage events with QR codes for lead capture at physical locations.
- **Showroom Management** — Track showroom details and associated walk-in leads.
- **Blog & SEO** — Create/edit blog posts and manage SEO meta tags for website pages.
- **Product Catalogue** — Manage products with images, inventory, and enquiry tracking.
- **Team Management** — Manage team members.
- **Analytics Dashboard** — Charts for sales, finance, and lead analytics.
- **Role-Based Access** — Users are scoped to showroom leads, website leads, or full admin access.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (Atlas or local)

### Backend

```bash
cd backend
npm install
```

Create `src/.env` (or copy `.env.development`):

```env
PORT=8000
NODE_ENV=development
DATABASE_URL=<your-mongodb-uri>
DBNAME=skydecorProd
JWT_SECRET=<your-secret>
ALLOWED_ORIGINS=http://localhost:5173
API_ENDPOINT=http://localhost:8000
ADMIN_SECRET=<your-admin-secret>
```

```bash
npm run dev       # development (nodemon)
npm start         # production
npm run start:pm2 # production with PM2 cluster mode
```

### Frontend

```bash
cd frontend
npm install
npm run dev       # starts at http://localhost:5173
npm run build     # production build
```

---

## API Overview

All routes are prefixed with `/api`.

### Auth — `/api/user`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register a new admin user |
| POST | `/login` | Login, sets JWT cookie |
| POST | `/logout` | Clear auth cookie |
| GET | `/me` | Get current user (rehydrates session) |

### Leads — `/api/lead`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/event/contact-form-submit/:place` | Submit event lead |
| GET | `/event/:place` | Get event leads by location |
| GET | `/event/download/:place` | Download event leads as Excel |
| POST | `/showroom/contact-form-submit` | Submit showroom lead |
| GET | `/showroom` | Get showroom leads |
| GET | `/showroom/download` | Download showroom leads as Excel |

### Admin — `/api/lead` (protected)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard` | Dashboard data for current user |
| GET | `/event/:place` | Event leads (admin scoped) |
| GET | `/event/download/:place` | Excel export |
| GET | `/showroom` | Showroom leads (paginated) |
| GET | `/showroom/download` | Excel export |
| GET | `/website/product/enquiry` | Website product enquiries |
| GET | `/website/contact/enquiry` | Website contact leads |
| GET | `/website/jobapplication/enquiry` | Job applications |
| GET | `/**/download` | Excel export for any of the above |
| GET | `/event/phone/:phone` | Look up lead by phone |
| PUT | `/event/phone/:phone` | Update lead by phone |

---

## Scripts

### Backend

```bash
npm run dev       # Start with nodemon (hot reload)
npm start         # Start in production mode
npm run lint      # Lint source files
npm run format    # Format with Prettier
```

### Frontend

```bash
npm run dev       # Vite dev server
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint
npm run format    # Prettier
npm run preview   # Preview production build locally
```
