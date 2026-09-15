******************Financial Analytics Dashboard***********************

A full-stack app to track, visualize, filter, and export financial transactions. Built with React + TypeScript (frontend) and Node.js + Express + MongoDB (backend), secured with JWT auth.

## Features

1. JWT login / logout with protected API routes
2. Dashboard with summary cards + revenue/expense line chart + category pie chart
3. Transaction table with search, filters (date, amount, category, status, user), sorting, and pagination
4. Configurable CSV export — pick columns, download directly in browser
5. Alert chips for success/error notifications

## 🛠️ Tech Stack
Frontend	            Backend
React + TypeScript	    Node.js + Express
Vite	                TypeScript
Material UI	            MongoDB + Mongoose
Recharts	            JWT + bcryptjs
Axios + React Router	csv-writer

✅ Prerequisites
Node.js 18+ and npm
MongoDB running locally (mongodb://localhost:27017) or a MongoDB Atlas URI

## 🚀 How to Run
1. Install dependencies

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
2. Configure environment
Create backend/.env:


PORT=5000
MONGODB_URI=mongodb://localhost:27017/financial
JWT_SECRET=secret_key_here
JWT_EXPIRES_IN=7d
Create frontend/.env:


VITE_API_URL=http://localhost:5000/api
3. Seed the database (first time only)
Put the sample data at backend/data/transactions.json, then:


cd backend
npm run seed
This loads 300 transactions and creates a demo user.

4. Start both servers
Terminal 1 — Backend:
cd backend
npm run dev
Runs on → http://localhost:5000

Terminal 2 — Frontend:
cd frontend
npm run dev
Runs on → http://localhost:5173

5. Login
Email	Password
demo@example.com	password123
Open http://localhost:5173/login and sign in.

## 🔌   API Endpoints
Method	 Endpoint	                    Description
POST	/api/auth/login	                Login, returns JWT
POST	/api/auth/register	            Register new user
GET	    /api/auth/me	                Current user
GET	    /api/transactions	            List with filters + pagination
GET	    /api/transactions/dashboard	    Dashboard metrics
GET	    /api/transactions/filters	    Filter dropdown options
POST	/api/transactions/export/csv	Generate & download CSV

All /transactions routes require header: Authorization: Bearer <token>

## Project Structure
financial-analytics-dashboard/
├── backend/
│   ├── data/transactions.json
│   └── src/
│       ├── controllers/    models/     middleware/
│       ├── routes/         services/   utils/
│       └── app.ts          server.ts
├── frontend/
│   └── src/
│       ├── components/     pages/
│       ├── services/       hooks/      types/
│       └── App.tsx         main.tsx
└── README.md