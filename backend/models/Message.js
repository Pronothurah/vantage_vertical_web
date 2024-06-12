// backend/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;