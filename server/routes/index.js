const express = require('express');
const agencies = require('./agencies');
const permits = require('./permits');
const quotations = require('./quotations');
const customQuotations = require('./customQuotations');
const quickbooks = require('./quickbooks');
const staff = require('./staff');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Alpha Systems API is running' });
});

// API routes
router.use('/agencies', agencies);
router.use('/permits', permits);
router.use('/quotations', quotations);
router.use('/custom-quotations', customQuotations);
router.use('/quickbooks', quickbooks);
router.use('/staff', staff);

module.exports = router; 