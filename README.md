# Referral Jobs Platform (MVP)

A full-stack starter for a referral-focused job board with sponsorship visibility.

## What Is Included

- Role-based auth for `job_seeker`, `job_poster`, `admin`
- Job posting with referral and sponsorship fields
- Job listing with search + filters
- Job details + apply + save flow
- Seeker dashboard (applied jobs, saved jobs, profile completion)
- Poster dashboard (posted jobs, applicants, resume links)
- Admin panel (analytics, pending job moderation, users)
- Resume upload to local disk (`/uploads/resumes`)
- MySQL schema and seed data

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL

## Project Structure

- `client/` React frontend
- `server/` Express REST API
- `database/` SQL schema + seed

## Setup

## 1) Database

1. Create DB and tables:

```bash
mysql -u root -p < database/schema.sql
```

2. Seed sample data:

```bash
mysql -u root -p < database/seed.sql
```

Sample seeded credentials (password for all users: `Password@123`):

- `admin@refjobs.com` (admin)
- `poster@refjobs.com` (job poster)
- `seeker@refjobs.com` (job seeker)

## 2) Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

- `PUBLIC_BASE_URL` (used in uploaded resume URLs)

## 3) Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs` (poster/admin)
- `POST /api/jobs/:id/apply` (seeker)
- `POST /api/jobs/:id/save` (seeker)
- `GET /api/jobs/saved/me` (seeker)
- `GET /api/profile/me` (seeker)
- `PUT /api/profile/me` (seeker)
- `GET /api/profile/dashboard/seeker`
- `GET /api/profile/dashboard/poster`
- `GET /api/admin/analytics` (admin)
- `GET /api/admin/users` (admin)
- `PATCH /api/admin/jobs/:id/moderate` (admin)
- `POST /api/uploads/resume` (authenticated, multipart file upload)

## Notes

- Uploaded files are stored locally under `server/uploads/resumes`.
- Match % is based on overlap of profile skills vs required job skills.
