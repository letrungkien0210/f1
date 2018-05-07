const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  refreshToken: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true },
  scope: { type: String }
})

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
