# BikeExpress frontend

A responsive React storefront and session-backed admin dashboard for the Spring Boot BikeExpress API.

## Run locally

1. Start Spring Boot at `http://localhost:8080` and make sure MySQL is available.
2. In this folder run `npm install`.
3. Run `npm run dev` and open Vite's local URL (usually `http://localhost:5173`).

Vite proxies `/api` to the backend. Set `VITE_API_ROOT` in `.env` if the API is hosted elsewhere.

## Features

- Email/password login routes customers to the storefront and the configured administrator to the dashboard.
- Admin dashboard with create, view, update, and delete actions for motorcycles, customers, and orders.
- Storefront search, filters, sorting, bike details, saved bikes, and order submission.
- Live catalog from `GET /api/bikes/getAllBikes`, with preview bikes when the API is unavailable or empty.

## Backend integration note

Admin login uses `BIKEXPRESS_ADMIN_EMAIL` and `BIKEXPRESS_ADMIN_PASSWORD` environment variables. For local development they default to `bikexpressadmin1@gmail.com` and `admin@123`; set your own values before deployment. Login creates a server session, and the backend restricts admin CRUD routes to that session. Existing user passwords stored in plain text are accepted once and upgraded to PBKDF2 hashes after a successful login; new and changed passwords are hashed before storage. The bike response has no category field, so live inventory appears under “Motorcycles.”

Customer accounts must already exist in the backend. The application routes them to the storefront after valid email/password sign-in. Keep database credentials and the admin password out of public deployments by providing environment variables and deployment secrets.
