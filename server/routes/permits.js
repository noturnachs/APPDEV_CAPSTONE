const express = require('express');
const permitController = require('../controllers/permitController');
const { authenticateToken, requireManagerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all permits
router.get('/', permitController.getAllPermits);

// Get permits by agency
router.get('/agency/:agencyId', permitController.getPermitsByAgency);

// Get permit by ID
router.get('/:id', permitController.getPermitById);

// Create new permit (protected - manager/admin only)
router.post('/', authenticateToken, requireManagerOrAdmin, permitController.createPermit);

// Update permit (protected - manager/admin only)
router.put('/:id', authenticateToken, requireManagerOrAdmin, permitController.updatePermit);

// Delete permit (protected - manager/admin only)
router.delete('/:id', authenticateToken, requireManagerOrAdmin, permitController.deletePermit);

module.exports = router; 