const Client = require('../models/Client');

// Create endpoint /api/client for POST
exports.postClients = function (req, res) {
  // Create a new instance of the Client model
  const client = new Client();

  // Set the client properties that came from the POST data
  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.userId = req.user._id;

  // Save the client and check for errors
  client.save((err) => {
    if (err) {
      res.send(err);
    }

    res.json({ message: 'Client added to the locker!', data: client });
  });
};

// Create endpoint /api/clients for GET
exports.getClients = function (req, res) {
  // Use the Client model to find all clients
  Client.find({ userId: req.user._id }, (err, clients) => {
    if (err) {
      res.send(err);
    }

    res.json(clients);
  });
};
