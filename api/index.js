const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Koneksi ke MongoDB
const mongoUrl = 'mongodb+srv://znslrd:znslrd021@gatau.mfiywiw.mongodb.net/?retryWrites=true&w=majority&appName=gatau';
const mongoDbName = 'comment-db';
const mongoCollectionName = 'comments';

async function getCommentsFromDb() {
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(mongoDbName);
  const comments = await db.collection(mongoCollectionName).find({}).toArray();
  client.close();
  return comments;
}

async function saveCommentToDb(comment) {
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(mongoDbName);
  await db.collection(mongoCollectionName).insertOne(comment);
  client.close();
}

// API endpoints
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await getCommentsFromDb();
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments from database:', error);
    res.status(500).json({ message: 'Error getting comments' });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { username, comment } = req.body;
    const newComment = { username, comment };
    await saveCommentToDb(newComment);
    res.json({ message: 'Komentar berhasil disimpan' });
  } catch (error) {
    console.error('Error saving comment to database:', error);
    res.status(500).json({ message: 'Error saving comment' });
  }
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// For Vercel deployment
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
}
