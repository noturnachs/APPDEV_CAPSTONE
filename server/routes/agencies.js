const express = require('express');
const agencyController = require('../controllers/agencyController');
const { authenticateToken, requireManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all agencies
router.get('/', agencyController.getAllAgencies);

// Get agency by ID
router.get('/:id', agencyController.getAgencyById);

// Create new agency (protected - manager/admin only)
router.post('/', authenticateToken, requireManagerOrAdmin, agencyController.createAgency);

// Update agency (protected - manager/admin only)
router.put('/:id', authenticateToken, requireManagerOrAdmin, agencyController.updateAgency);

// Delete agency (protected - manager/admin only)
router.delete('/:id', authenticateToken, requireManagerOrAdmin, agencyController.deleteAgency);

module.exports = router; 