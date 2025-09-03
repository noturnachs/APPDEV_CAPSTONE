class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class BusinessLogicError extends Error {
  constructor(message, code = 'BUSINESS_ERROR') {
    super(message);
    this.name = 'BusinessLogicError';
    this.code = code;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

const validateRequired = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
};

const validateEmail = (email) => {
  if (!email) {
    throw new ValidationError('Email is required', 'email');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
};

const validateId = (id, fieldName = 'id') => {
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError(`Invalid ${fieldName} provided`, fieldName);
  }
  return parseInt(id);
};

const validateQuotationData = (data) => {
  validateRequired(data.firstName, 'firstName');
  validateRequired(data.lastName, 'lastName');
  validateEmail(data.email);
  validateRequired(data.phone, 'phone');
  validateRequired(data.serviceType, 'serviceType');
};

const validateStaffLogin = (email, password) => {
  validateEmail(email);
  validateRequired(password, 'password');
};

const validateStaffData = (data) => {
  validateRequired(data.first_name, 'first_name');
  validateRequired(data.last_name, 'last_name');
  validateEmail(data.email);
  validateRequired(data.role, 'role');
  
  const validRoles = ['employee', 'manager', 'admin'];
  if (!validRoles.includes(data.role)) {
    throw new ValidationError('Invalid role. Must be employee, manager, or admin', 'role');
  }
};

module.exports = {
  ValidationError,
  BusinessLogicError,
  NotFoundError,
  validateRequired,
  validateEmail,
  validateId,
  validateQuotationData,
  validateStaffLogin,
  validateStaffData
};