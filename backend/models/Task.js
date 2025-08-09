// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  priority: { type: String, required: true },
  reminder: Date,
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', taskSchema);
