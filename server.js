const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

const commentsFile = path.join(__dirname, 'comments.json');

app.get('/comments', (req, res) => {
  fs.readFile(commentsFile, (err, data) => {
    if (err) {
      res.status(500).send({ message: 'Error reading comments file' });
    } else {
      res.send(JSON.parse(data));
    }
  });
});

app.post('/comments', (req, res) => {
  const { username, comment } = req.body;
  fs.readFile(commentsFile, (err, data) => {
    if (err) {
      res.status(500).send({ message: 'Error reading comments file' });
    } else {
      const comments = JSON.parse(data);
      comments.push({ username, comment });
      fs.writeFile(commentsFile, JSON.stringify(comments), (err) => {
        if (err) {
          res.status(500).send({ message: 'Error writing comments file' });
        } else {
          res.send({ message: 'Comment added successfully' });
        }
      });
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
