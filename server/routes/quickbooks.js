const express = require('express');
const quickbooksController = require('../controllers/quickbooksController');

const router = express.Router();

// Get authorization URL
router.get('/auth', quickbooksController.getAuthUrl);

// Handle OAuth callback
router.get('/callback', quickbooksController.handleCallback);

// Get connection status
router.get('/status', quickbooksController.getConnectionStatus);

// Get permits from QuickBooks
router.get('/permits', quickbooksController.getPermits);

// Create estimate in QuickBooks
router.post('/estimate', quickbooksController.createEstimate);

// Get tax rates from QuickBooks
router.get('/tax-rates', quickbooksController.getTaxRates);

// Get tax codes from QuickBooks
router.get('/tax-codes', quickbooksController.getTaxCodes);

module.exports = router; 