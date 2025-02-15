// backend/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err); // Logs the error to the server console
    res.status(500).json({
      message: 'An unexpected error occurred.',
      error: err.message,
    });
  };
  
  module.exports = errorHandler;
  