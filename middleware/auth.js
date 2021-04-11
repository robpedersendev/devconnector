const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from the header. Looking for the header of "x-auth-token"
  const token = req.header('x-auth-token');

  // Check if there is no token
  if (!token) {
    //Return a message with a 401 response.
    return res.status(401).json({ msg: 'No Token. Authorization denied' });
  }

  // Verify there is a token
  try {
    // If its valid
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // This req.user will be accessible in any protected routess
    req.user = decoded.user;
    // Call next since this is a middleware
    next();
    // If the token is not valid
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
