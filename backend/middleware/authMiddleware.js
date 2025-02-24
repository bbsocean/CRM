// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verifiedUser;
//     next();
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// const authorizeRole = (allowedRoles) => (req, res, next) => {
//   if (!allowedRoles.includes(req.user.role)) {
//     return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
//   }
//   next();
// };

// module.exports = { authenticateToken, authorizeRole };


const jwt = require('jsonwebtoken');

// ✅ Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized access. Token missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please log in again.' });
      } else {
        return res.status(403).json({ message: 'Token is invalid or tampered.' });
      }
    }
    req.user = decoded;
    next();
  });
};

// ✅ Middleware for role-based access control (RBAC)
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// ✅ Optional CSRF protection using a token-based approach (can be expanded as needed)
exports.csrfProtection = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'];
  if (!csrfToken || csrfToken !== process.env.CSRF_SECRET) {
    return res.status(403).json({ message: 'Invalid or missing CSRF token.' });
  }
  next();
};

// ✅ Tagged Middleware (Generalized Middleware with Role Support)
exports.authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user has the required roles
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      // Assign decoded user info to request
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized. Please log in again.', error });
    }
  };
};
