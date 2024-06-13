// middleware.js

const validateAPIKey = (req, res, next) => {
    try {
      // Retrieve API key from Authorization header
      const apiKey = req.headers.authorization;
  
      // Check if API key exists and is valid (example logic)
      if (!apiKey || apiKey !== 'your_api_key_here') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Error validating API key:', error);
      res.status(500).json({ message: 'Failed to validate API key' });
    }
  };
  
  module.exports = {
    validateAPIKey,
  };
  