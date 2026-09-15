Financial Analytics Dashboard

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



## 🔌   API Endpoints
Method	 Endpoint	                    

POST	/api/auth/login	                

POST	/api/auth/register	           

GET	    /api/auth/me	             

GET	    /api/transactions	           

GET	    /api/transactions/dashboard	   

GET	    /api/transactions/filters	

POST	/api/transactions/export/csv

All /transactions routes require header: Authorization: Bearer <token>

