// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async (req, res) => {
  try {
    const { username, email, text } = req.body;
    const newMessage = new Message({ username, email, text });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;