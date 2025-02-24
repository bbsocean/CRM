const { body, validationResult } = require('express-validator');

exports.validateAuth = (type) => {
  switch (type) {
    case 'register':
      return [
        body('email')
          .isEmail().withMessage('Please enter a valid email address')
          .normalizeEmail(),

        body('password')
          .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
          .matches(/\d/).withMessage('Password must contain at least one number')
          .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
          .trim(),

        body('name').notEmpty().withMessage('Name is required').trim(),

        (req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
          next();
        }
      ];

    case 'login':
      return [
        body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
        (req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
          next();
        }
      ];
  }
};
