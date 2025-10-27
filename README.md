# React MongoDB Todo App

A full-stack todo list application built with React, MongoDB, and Express with JWT authentication.

## Features

- **User Authentication**: Sign up and login with secure JWT tokens
- **User-specific todos**: Each user sees only their own todos
- **Create new todos**: Add todos with a clean interface
- **Mark todos complete/incomplete**: Toggle completion status
- **Delete todos**: Remove unwanted todos
- **Beautiful UI**: Built with Shadcn UI components and Tailwind CSS
- **Secure**: Passwords hashed with bcrypt, JWT authentication

## Prerequisites

- Node.js installed on your system
- MongoDB running locally at `mongodb://localhost:27017/`

## Installation

1. Clone or download the project
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Start the Backend

From the `backend` directory:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Start the Frontend

From the `frontend` directory (in a new terminal):
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Make sure MongoDB is running locally
2. Start the backend server
3. Start the frontend development server
4. Open `http://localhost:5173` in your browser
5. **Sign up** with your name, email, and password (minimum 6 characters)
6. You'll be automatically logged in
7. Start adding todos!
8. Use the **Logout** button to sign out

**Note**: Each user has their own private todo list. Todos are isolated per user.

## Tech Stack

- **Frontend**: React, Vite, Shadcn UI, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB (local)
- **Authentication**: JWT (jsonwebtoken), bcrypt for password hashing
- **Validation**: express-validator

## Project Structure

```
├── backend/
│   ├── server.js          # Express server with API routes
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── lib/          # Utility functions
│   │   └── App.jsx       # Main app component
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user (name, email, password)
- `POST /api/auth/login` - Login user (email, password)
- `GET /api/auth/me` - Get current user info (protected)

### Todos (all protected - requires authentication)
- `GET /api/todos` - Get current user's todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

**Note**: All todo endpoints require authentication via JWT token in Authorization header.

