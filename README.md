# MedCare Frontend

Frontend web app for searching doctors and booking appointments.

## Tech Stack

- React 19
- Vite 5
- React Router
- i18next (EN/IT)
- Vitest + Testing Library

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Run Locally

```bash
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Run Tests

```bash
npm run test
```

## Project Structure

- `src/pages`: main app pages
- `src/components`: reusable UI components
- `src/styles`: CSS files
- `src/api`: API clients/helpers
- `src/locales`: translation files

