# Meteo

Meteo is a full-stack weather intelligence platform for Rwanda built with React, Node.js, Express, and MongoDB. It provides user and admin authentication, OpenWeatherMap integration, automated forecast emails, and unusual login alerts.

## Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS, Context API
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer, node-cron

## Project Structure

```text
client/   React application
server/   Express API
```

## Environment Setup

Create `server/.env` from `server/.env.example` and fill in real credentials:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/meteo
JWT_SECRET=replace_with_a_long_random_secret
OPENWEATHER_API_KEY=your_openweather_api_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM="Meteo <your_email@example.com>"

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me

CRON_TIME=0 7 * * *
CRON_TIMEZONE=Africa/Kigali
```

## Install

```bash
npm run install:all
```

Or install each app directly:

```bash
npm install --prefix server
npm install --prefix client
```

## Run

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm start
```

For backend development with auto-reload:

```bash
npm run server:dev
```

## Features

- JWT authentication with role-based access
- Admin login backed by environment variables
- User profile location management
- Current weather and 5-day forecast via OpenWeatherMap
- Welcome emails after signup
- Daily forecast emails via cron
- Unusual login alert emails based on IP and device changes
- Admin dashboard for users, logs, stats, and manual broadcasts

## Important Security Note

The existing `src/server/.env` in this workspace contains what appear to be real credentials. Rotate those secrets immediately and keep only `server/.env` with fresh values for production use.
