// const { body, validationResult } = require('express-validator');

// // Middleware for validating sale creation requests
// exports.validateSaleCreation = [
//   body('agentId')
//     .notEmpty().withMessage('Agent ID is required')
//     .isMongoId().withMessage('Invalid Agent ID format'),
    
//   body('customerId')
//     .notEmpty().withMessage('Customer ID is required')
//     .isMongoId().withMessage('Invalid Customer ID format'),

//   body('productName')
//     .notEmpty().withMessage('Product name is required'),

//   body('saleAmount')
//     .notEmpty().withMessage('Sale amount is required')
//     .isFloat({ min: 0 }).withMessage('Sale amount must be a positive number'),

//   // Handle validation errors
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();  // Proceed to the next middleware or controller if valid
//   }
// ];


const { body, validationResult } = require('express-validator');

// Middleware for validating sale creation requests
exports.validateSaleCreation = [
  // Validate agentId
  body('agentId')
    .notEmpty().withMessage('Agent ID is required')
    .isMongoId().withMessage('Invalid Agent ID format'),

  // Validate customerId
  body('customerId')
    .notEmpty().withMessage('Customer ID is required')
    .isMongoId().withMessage('Invalid Customer ID format'),

  // Validate productName
  body('productName')
    .notEmpty().withMessage('Product name is required'),

  // Validate saleAmount
  body('saleAmount')
    .notEmpty().withMessage('Sale amount is required')
    .isFloat({ min: 0 }).withMessage('Sale amount must be a positive number'),

  // Validate franchiseeId (optional field)
  body('franchiseeId')
    .optional()
    .isMongoId().withMessage('Invalid Franchisee ID format'),

  // Validate territoryHeadId (optional field)
  body('territoryHeadId')
    .optional()
    .isMongoId().withMessage('Invalid Territory Head ID format'),

  // Validate vendorId (optional field)
  body('vendorId')
    .optional()
    .isMongoId().withMessage('Invalid Vendor ID format'),

  // Validate referredBy (optional referral ID)
  body('referredBy')
    .optional()
    .isMongoId().withMessage('Invalid Referral ID format'),

  // Validate customerVendorId (optional field for customer-turned-vendor)
  body('customerVendorId')
    .optional()
    .isMongoId().withMessage('Invalid Customer Vendor ID format'),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();  // Proceed to the next middleware or controller if valid
  }
];

