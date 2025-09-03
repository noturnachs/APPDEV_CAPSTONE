const express = require('express');
const customQuotationController = require('../controllers/customQuotationController');
const { authenticateToken, requireManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`\n=== CUSTOM QUOTATIONS ROUTE DEBUG ===`);
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  console.log('=== END DEBUG ===\n');
  next();
});

// Send quotation via custom email service (protected)
router.post('/:id/send-custom', authenticateToken, requireManagerOrAdmin, customQuotationController.sendQuotation);

// Handle quotation response (public endpoint for client responses)
router.post('/response', customQuotationController.handleQuotationResponse);

// Verify response token (public endpoint for client-side validation)
router.get('/verify-token', customQuotationController.verifyResponseToken);

// Get quotation PDF (public endpoint for client access)
router.get('/:id/pdf', customQuotationController.getQuotationPDF);

module.exports = router;
