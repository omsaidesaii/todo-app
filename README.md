# React MongoDB Todo App

A full-stack todo list application built with React, MongoDB, and Express.

## Features

- Create new todos
- Mark todos as complete/incomplete
- Delete todos
- Beautiful UI with Shadcn components
- Real-time data persistence with MongoDB

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
5. Start adding todos!

## Tech Stack

- **Frontend**: React, Vite, Shadcn UI, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB (local)

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

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

