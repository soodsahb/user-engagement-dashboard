## Project Structure
- `/frontend` - React frontend built with Vite
- `/backend` - Node.js/Express backend with MongoDB


## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

## Local Setup Instructions

### Backend Setup
1. Navigate to backend directory:
cd backend

2. Install dependencies:
npm install

3. Create .env file in backend directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string

5. Start backend server:
npm start


### Frontend Setup
1. Navigate to frontend directory:
cd frontend

2. Install dependencies:
npm install

3. Start frontend development server:
npm run dev

### Generate Mock Data
1. After setting up both servers, make a POST request to : (Use postman)
POST http://localhost:5000/api/generate-mock-data


This will populate your database with mock users and activity data.

## Available Features
- Dashboard metrics overview
- User activity monitoring
- AI-powered engagement insights
- Feature usage tracking
- User retention analysis
- Activity logging

## Tech Stack
- Frontend: React, Material-UI, Recharts
- Backend: Node.js, Express, MongoDB
- Additional: RESTful API, Real-time metrics

## Notes
- The application uses MongoDB Atlas for database management
- Mock data is provided for demonstration purposes
- All metrics and AI insights are simulated for demo