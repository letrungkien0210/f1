// Load required packages
const mongoose = require('mongoose');

// Define our client schema
const ClientSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, unique: true, required: true },
  secret: { type: String, required: true },
  clientId: { type: String },
  trustedClient: { type: Boolean }
});

// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);
