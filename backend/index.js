// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/vantage_vertical';
mongoose.connect(mongoURI, {  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/messages', messageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});