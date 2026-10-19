# BikeExpress frontend

A responsive React storefront for the Spring Boot BikeExpress API.

## Run locally

1. Start Spring Boot at `http://localhost:8080` and make sure MySQL is available.
2. In this folder run `npm install`.
3. Run `npm run dev` and open Vite's local URL (usually `http://localhost:5173`).

Vite proxies `/api` to the backend. Set `VITE_API_ROOT` in `.env` if the API is hosted elsewhere.

## Features

- Search, category filters, price sorting, and bike detail views.
- Saved bikes in browser storage, a working shopping bag, and responsive layouts.
- Live catalog from `GET /api/bikes/getAllBikes`, with preview bikes when the API is unavailable or empty.

## Backend integration note

The current public bike DTO omits `bikeId`, and the user response omits `userId`. Orders and wishlist endpoints require those IDs. The frontend therefore does not submit fake orders or wishlist records; checkout explains the missing fields. To enable order submission, include `bikeId` in the public bike response, `userId` in the user response, and provide a supported sign-in/session flow. The bike response has no category field either, so live inventory appears under “Motorcycles.”
