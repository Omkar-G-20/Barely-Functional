# Barely Functional

Barely Functional is a React frontend for AI-assisted feed and silage quality analysis. It provides a farmer-focused interface for selecting samples, reviewing analysis results, viewing recommendations, and managing reports and profile settings.

## Tech Stack

- React 18
- Vite
- React Router
- Lucide React icons

The current frontend uses mock data and does not require a backend service to run.

## Requirements

- Node.js 18 or newer
- npm

## Run the Frontend

From the project folder:

```bash
npm install
npm run dev
```

Vite will print a local URL in the terminal. Open the default URL below if it is available:

```text
http://localhost:5173
```

To stop the development server, press `Ctrl+C` in the terminal.

## Check the Frontend

Start at `/` and verify the following flows in the browser:

- Landing page: `/`
- Registration and login: `/register`, `/login`
- Dashboard: `/dashboard`
- Sample selection: `/sample-selection`
- Feed and silage analysis: `/feed-analysis`, `/silage-analysis`
- Results and advisory: `/result`, `/advisory`
- History and report: `/history`, `/report`
- Profile and settings: `/profile`, `/settings`

The pages are connected through the navigation and use local mock content, so no API keys or database setup are needed for this frontend check.

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Repository

GitHub: https://github.com/Omkar-G-20/Barely-Functional