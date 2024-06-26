const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }
  
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token.' });
    }
    req.user = decoded;
    next();
  });
};

const getUserEmail = async (user) => {
  // Assume user object has email property. Modify as per your actual implementation.
  return user.email;
};

module.exports = { verifyToken, getUserEmail };
