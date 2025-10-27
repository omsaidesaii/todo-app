const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

let db;
let client;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Routes
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await db.collection('todos').find({}).toArray();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const todo = {
      text,
      completed: false,
      createdAt: new Date()
    };
    
    const result = await db.collection('todos').insertOne(todo);
    const insertedTodo = await db.collection('todos').findOne({ _id: result.insertedId });
    res.status(201).json(insertedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    const update = {};
    if (text !== undefined) update.text = text;
    if (completed !== undefined) update.completed = completed;
    
    const result = await db.collection('todos').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const updatedTodo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
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

