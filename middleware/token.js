const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  // Implement the middleware function based on the options object
  const bearerHeader = req.headers['authorization'];

  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    
    // Set the token
    req.token = bearerToken;
    console.log(req.token)
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

