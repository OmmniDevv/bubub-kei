const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Path ke file JSON
const commentsFilePath = path.join(__dirname, 'comments.json');

// Fungsi untuk membaca komentar dari file JSON
function getCommentsFromFile() {
  try {
    const commentsData = fs.readFileSync(commentsFilePath, 'utf8');
    return JSON.parse(commentsData);
  } catch (error) {
    console.error('Error reading comments file:', error);
    return [];
  }
}

// Fungsi untuk menyimpan komentar ke file JSON
function saveCommentToFile(comment) {
  try {
    const comments = getCommentsFromFile();
    comments.push(comment);
    fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error('Error saving comment to file:', error);
  }
}

// API endpoints
app.get('/api/comments', (req, res) => {
  res.json(getCommentsFromFile());
});

app.post('/api/comments', (req, res) => {
  const { username, comment } = req.body;
  const newComment = { username, comment };
  saveCommentToFile(newComment);
  res.json({ message: 'Komentar berhasil disimpan' });
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
