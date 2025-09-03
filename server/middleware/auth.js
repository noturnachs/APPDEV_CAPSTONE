const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    
    // Check if user still exists and is active
    const staff = await prisma.staff.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, 
        email: true, 
        role: true, 
        is_active: true,
        first_name: true,
        last_name: true
      }
    })

    if (!staff || !staff.is_active) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid or inactive user' 
      })
    }

    // Add user info to request
    req.user = staff
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expired' 
      })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      })
    }
    
    console.error('Auth middleware error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication error' 
    })
  }
}

// Middleware to require specific roles
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      })
    }

    next()
  }
}

// Middleware to require manager or admin role
const requireManagerOrAdmin = (req, res, next) => {
  return requireRole(['manager', 'admin'])(req, res, next)
}

// Middleware to require admin role only
const requireAdmin = (req, res, next) => {
  return requireRole(['admin'])(req, res, next)
}

module.exports = {
  authenticateToken,
  requireRole,
  requireManagerOrAdmin,
  requireAdmin
} 