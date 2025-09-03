const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const quickbooksService = require('./services/quickbooksService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Catch-all for unhandled routes (for debugging)
app.use((req, res, next) => {
  console.log(`\n=== UNHANDLED ROUTE ===`);
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Available routes did not match');
  console.log('=== END UNHANDLED ===\n');
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize QuickBooks service
  try {
    await quickbooksService.initialize();
    console.log('QuickBooks service initialized successfully');
  } catch (error) {
    console.error('Failed to initialize QuickBooks service:', error);
  }
}); 