const staffService = require('../services/staffService');
const { validateStaffLogin, validateStaffData, validateId, ValidationError, BusinessLogicError, NotFoundError } = require('../utils/validation');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    validateStaffLogin(email, password);
    
    const result = await staffService.login(email, password);
    
    console.log('✅ Staff login successful:', email);
    res.json({
      success: true,
      message: 'Login successful',
      token: result.token,
      staff: result.staff
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else if (error instanceof BusinessLogicError) {
      if (error.message.includes('deactivated')) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const getProfile = async (req, res) => {
  try {
    const staffId = req.staff.id; // From auth middleware
    const staff = await staffService.getProfile(staffId);
    res.json({ staff });
  } catch (error) {
    console.error('Get profile error:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staff = await staffService.getAllStaff();
    res.json({ staff });
  } catch (error) {
    console.error('Get all staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getActiveStaff = async (req, res) => {
  try {
    const staff = await staffService.getActiveStaff();
    res.json({ staff });
  } catch (error) {
    console.error('Get active staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createStaff = async (req, res) => {
  try {
    validateStaffData(req.body);
    const staff = await staffService.createStaff(req.body);
    
    console.log('✅ Staff created successfully:', staff.email);
    res.status(201).json({ staff });
  } catch (error) {
    console.error('Create staff error:', error);
    
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};

const updateStaff = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'staff ID');
    
    // Only validate fields that are being updated
    if (req.body.email || req.body.first_name || req.body.last_name || req.body.role) {
      validateStaffData({ ...req.body, password: req.body.password || 'temp' });
    }
    
    const staff = await staffService.updateStaff(id, req.body);
    
    console.log('✅ Staff updated successfully:', id);
    res.json({ staff });
  } catch (error) {
    console.error('Update staff error:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};

const deleteStaff = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'staff ID');
    await staffService.deleteStaff(id);
    
    console.log('🗑️ Staff deleted successfully:', id);
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};

module.exports = {
  login,
  getProfile,
  getAllStaff,
  getActiveStaff,
  createStaff,
  updateStaff,
  deleteStaff
}; 