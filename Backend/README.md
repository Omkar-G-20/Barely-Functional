# AgriSense AI Backend

Express REST API for the existing AgriSense AI React frontend.

## Current scope

- Registration and login with JWT
- Authenticated profile
- User settings
- Feed analysis API
- Silage analysis API
- Analysis history
- Dashboard statistics
- Reports
- Report download as JSON
- Image upload using Multer
- Preliminary rule-based analysis service

## Important

This version intentionally uses an in-memory repository instead of a real database.

That means:
- data resets whenever the server restarts;
- the database teammate must replace `src/repositories/memoryRepository.js` with a MongoDB/PostgreSQL/etc. implementation;
- the API contract should remain unchanged so the React frontend does not need to care which database is used.

The AI service is also a placeholder. Replace `src/services/analysisService.js` with the actual ML/model integration when the model is ready.

## Run

```bash
npm install
copy .env.example .env
npm run dev
```

Linux/macOS:

```bash
cp .env.example .env
npm install
npm run dev
```

Server:
`http://localhost:5000`

Health check:
`GET /api/health`

## Authentication

Send:

`Authorization: Bearer <token>`

after login/register.

## Main endpoints

POST `/api/auth/register`
POST `/api/auth/login`
GET `/api/auth/me`

GET `/api/profile`
PATCH `/api/profile`

GET `/api/settings`
PATCH `/api/settings`

POST `/api/analysis/feed`
POST `/api/analysis/silage`
GET `/api/analysis/history`
GET `/api/analysis/:id`

GET `/api/dashboard`
GET `/api/reports`
GET `/api/reports/:id/download`

## Multipart fields

Feed:
- image: optional image file
- moisture: optional number
- protein: optional number
- fiber: optional number

Silage:
- image: optional image file
- moisture: optional number
- ph: optional number
- temperature: optional number
