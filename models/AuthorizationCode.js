const mongoose = require('mongoose');

const AuthorizationCodeSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  code: { type: String, unique: true, required: true },
  clientId: { type: String },
  redirectUri: { type: String, required: true },
  userId: { type: String, required: true },
  scope: { type: String },
})

module.exports = mongoose.model('AuthorizationCode', AuthorizationCodeSchema);
