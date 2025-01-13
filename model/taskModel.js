const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['in progress','hold','pending', 'completed'],
    default: 'pending',
  },
  due_date: {
    type: Date,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
