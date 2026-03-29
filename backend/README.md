# Student Tracker Backend

This is the backend for the Student Tracker web application, using Node.js, Express, and SQLite.

## Setup

1. Ensure Node.js is installed (version 14 or higher).
2. Navigate to the backend directory.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the server on http://localhost:3000.

## API Endpoints

- POST /api/register - Register a new user
- POST /api/login - Login user
- GET /api/profile/:id - Get user profile
- PUT /api/profile/:id - Update user profile
- GET /api/users - Get all users (admin)
- PUT /api/users/:id - Update user (admin)
- DELETE /api/users/:id - Delete user (admin)

## Database

Uses SQLite database `student_tracker.db` with a `users` table.