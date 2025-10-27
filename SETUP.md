# Quick Setup Guide

## Important: Follow these steps in order!

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

This installs:
- express
- mongodb
- cors
- dotenv
- bcryptjs (for password hashing)
- jsonwebtoken (for authentication)
- express-validator (for input validation)

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 3: Start MongoDB
Make sure MongoDB is running on your system at `mongodb://localhost:27017/`

### Step 4: Start the Backend Server
```bash
cd backend
npm start
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

### Step 5: Start the Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

### Step 6: Open Your Browser
Go to `http://localhost:5173`

## Troubleshooting

### "Unexpected token '<'" Error
This means the backend isn't running or isn't responding with JSON. Make sure:
1. Backend is running on port 5000
2. MongoDB is running
3. Backend dependencies are installed

### Cannot find module errors
Run `npm install` in both backend and frontend directories.

### Connection refused
- Check that MongoDB is running
- Check that backend started successfully
- Check the browser console for errors

