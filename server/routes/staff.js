const express = require('express');
const staffController = require('../controllers/staffController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', staffController.login);

// Protected routes
router.use(authenticateToken);

router.get('/profile', staffController.getProfile);
router.get('/', staffController.getAllStaff);
router.get('/active', staffController.getActiveStaff);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

module.exports = router; 