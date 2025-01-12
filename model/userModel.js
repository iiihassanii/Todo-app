const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: false,
  },
  tasks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('User', userSchema);
