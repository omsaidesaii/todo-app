const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://todo-app-delta-two-56.vercel.app'],
  credentials: true
}));
app.use(express.json());

let db;
let client;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    app.locals.db = db; // Make db accessible to routes
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Auth routes
app.use('/api/auth', authRoutes);

// Routes
app.get('/api/todos', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const todos = await db.collection('todos').find({ userId: req.user.id }).toArray();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', auth, async (req, res) => {
  try {
    const { text, dueDate, category } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const db = req.app.locals.db;
    const todo = {
      text,
      completed: false,
      userId: req.user.id,
      category: category || 'General',
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: new Date()
    };
    
    const result = await db.collection('todos').insertOne(todo);
    const insertedTodo = await db.collection('todos').findOne({ _id: result.insertedId });
    res.status(201).json(insertedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/todos/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed, dueDate, category } = req.body;
    const db = req.app.locals.db;
    
    // Verify ownership
    const todo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    if (todo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const update = {};
    if (text !== undefined) update.text = text;
    if (completed !== undefined) update.completed = completed;
    if (dueDate !== undefined) update.dueDate = dueDate ? new Date(dueDate) : null;
    if (category !== undefined) update.category = category;
    
    const result = await db.collection('todos').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    
    const updatedTodo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    
    // Verify ownership
    const todo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    if (todo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectToDatabase();
});

