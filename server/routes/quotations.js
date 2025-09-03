const express = require('express');
const quotationController = require('../controllers/quotationController');
const { authenticateToken, requireManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`\n=== QUOTATIONS ROUTE DEBUG ===`);
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  console.log('=== END DEBUG ===\n');
  next();
});

// Log all registered routes for debugging
console.log('Registering quotations routes...');
console.log('Available routes will be:');
console.log('- POST /api/quotations/');
console.log('- POST /api/quotations/:id/send');
console.log('- GET /api/quotations/');
console.log('- GET /api/quotations/available-permits');
console.log('- GET /api/quotations/:id');
console.log('- PUT /api/quotations/test');
console.log('- PUT /api/quotations/:id');
console.log('- DELETE /api/quotations/:id');
console.log('- POST /api/quotations/:id/permits');
console.log('- DELETE /api/quotations/:id/permits/:permitId');
console.log('- GET /api/quotations/:id/permits');

// Create quotation (public endpoint for customer submissions)
router.post('/', quotationController.createQuotation);

// Send quotation via QuickBooks
router.post('/:id/send', quotationController.sendQuotation);

// Get all quotations (protected)
router.get('/', authenticateToken, quotationController.getAllQuotations);

// Get available permits (must be before :id route)
router.get('/available-permits', quotationController.getAvailablePermits);

// Get quotation by ID (protected)
router.get('/:id', authenticateToken, quotationController.getQuotationById);

// Handle OPTIONS preflight for PUT requests
router.options('/:id', (req, res) => {
  console.log('OPTIONS preflight request for quotation update');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Test PUT route
router.put('/test', (req, res) => {
  console.log('TEST PUT route hit successfully');
  res.json({ message: 'PUT method works', method: req.method, url: req.originalUrl });
});

// Update quotation (protected)
router.put('/:id', authenticateToken, requireManagerOrAdmin, quotationController.updateQuotation);

// Delete quotation (protected)
router.delete('/:id', authenticateToken, requireManagerOrAdmin, quotationController.deleteQuotation);

// Permit management endpoints (protected)
router.post('/:id/permits', authenticateToken, requireManagerOrAdmin, quotationController.addPermitToQuotation);
router.delete('/:id/permits/:permitId', authenticateToken, requireManagerOrAdmin, quotationController.removePermitFromQuotation);
router.get('/:id/permits', authenticateToken, quotationController.getQuotationPermits);

module.exports = router; 