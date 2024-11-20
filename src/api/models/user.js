const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  email: { type: String, unique: true },
  role: { type: String, enum: ['admin', 'user', 'invite'], default: 'invite' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
