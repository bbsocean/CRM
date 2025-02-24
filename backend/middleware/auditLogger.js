const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/audit.log");

const auditLogger = (req, res, next) => {
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - User: ${
    req.user ? req.user.id : "Anonymous"
  }\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write audit log:", err);
    }
  });

  next();
};

module.exports = auditLogger;
