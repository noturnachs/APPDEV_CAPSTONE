const staffRepository = require('../repositories/staffRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError, BusinessLogicError } = require('../utils/validation');

class StaffService {
  // Validate login credentials
  async validateLogin(email, password) {
    const staff = await staffRepository.findByEmail(email);
    
    if (!staff) {
      throw new BusinessLogicError('Invalid email or password');
    }

    if (!staff.is_active) {
      throw new BusinessLogicError('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      throw new BusinessLogicError('Invalid email or password');
    }

    return staff;
  }

  // Generate JWT token
  generateToken(staff) {
    return jwt.sign(
      { 
        id: staff.id, 
        email: staff.email, 
        role: staff.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  // Login staff member
  async login(email, password) {
    const staff = await this.validateLogin(email, password);
    const token = this.generateToken(staff);
    
    // Remove password from response
    const { password: _, ...staffInfo } = staff;
    
    return {
      token,
      staff: staffInfo
    };
  }

  // Get staff profile
  async getProfile(staffId) {
    const staff = await staffRepository.findById(staffId, {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      is_active: true,
      created_at: true
    });

    if (!staff) {
      throw new NotFoundError('Staff not found');
    }

    return staff;
  }

  // Get all staff members
  async getAllStaff() {
    return await staffRepository.findAll();
  }

  // Get active staff members
  async getActiveStaff() {
    return await staffRepository.findActiveStaff();
  }

  // Create new staff member
  async createStaff(staffData) {
    // Hash password
    const hashedPassword = await bcrypt.hash(staffData.password, 12);
    
    const staff = await staffRepository.create({
      ...staffData,
      password: hashedPassword,
      email: staffData.email.toLowerCase()
    });

    // Remove password from response
    const { password: _, ...staffInfo } = staff;
    
    return staffInfo;
  }

  // Update staff member
  async updateStaff(id, staffData) {
    const existingStaff = await staffRepository.findById(id);
    
    if (!existingStaff) {
      throw new NotFoundError('Staff not found');
    }

    // Hash password if provided
    if (staffData.password) {
      staffData.password = await bcrypt.hash(staffData.password, 12);
    }

    // Ensure email is lowercase
    if (staffData.email) {
      staffData.email = staffData.email.toLowerCase();
    }

    const updatedStaff = await staffRepository.update(id, staffData);
    
    // Remove password from response
    const { password: _, ...staffInfo } = updatedStaff;
    
    return staffInfo;
  }

  // Delete staff member
  async deleteStaff(id) {
    const staff = await staffRepository.findById(id);
    
    if (!staff) {
      throw new NotFoundError('Staff not found');
    }

    return await staffRepository.delete(id);
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new BusinessLogicError('Invalid token');
    }
  }
}

module.exports = new StaffService(); 