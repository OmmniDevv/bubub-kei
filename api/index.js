const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// API endpoints
app.get('/api/comments', (req, res) => {
  // Ganti dengan logika untuk mengambil semua komentar dari database
  res.json([
    { username: 'Alik', comment: 'cihuyy' },
  ]);
});

app.post('/api/comments', (req, res) => {
  // Ganti dengan logika untuk menyimpan komentar ke database
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
