// Load required packages
const mongoose = require('mongoose');

// Define our token schema
const TokenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true},
  token: { type: String, required: true },
  userId: { type: String },
  clientId: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  scope: { type: String }
});

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);
