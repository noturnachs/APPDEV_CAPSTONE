const OAuthClient = require('intuit-oauth');
const quickbooksService = require('../services/quickbooksService');
const quickbooksTokensRepository = require('../repositories/quickbooksTokensRepository');

// QuickBooks OAuth setup
const oauthClient = new OAuthClient({
  clientId: process.env.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
  environment: 'sandbox', // Change to 'production' for live
  redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
});

const getAuthUrl = (req, res) => {
  try {
    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: 'teststate'
    });
    res.json({ authUrl: authUri });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
};

const handleCallback = async (req, res) => {
  try {
    const authResponse = await oauthClient.createToken(req.url);
    const tokens = authResponse.token;
    
    // Save tokens to database
    await quickbooksTokensRepository.create({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      realm_id: tokens.realmId,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type
    });

    // Initialize the service with new tokens
    await quickbooksService.initialize();
    
    res.json({ 
      success: true, 
      message: 'QuickBooks connected successfully!',
      realmId: tokens.realmId 
    });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'OAuth authentication failed' });
  }
};

const getConnectionStatus = async (req, res) => {
  try {
    const status = await quickbooksService.getConnectionStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting connection status:', error);
    res.status(500).json({ error: 'Failed to get connection status' });
  }
};

const getPermits = async (req, res) => {
  try {
    const items = await quickbooksService.getItems();
    
    const permits = items.filter(item => item.Type === 'Service').map(item => ({
      id: item.Id,
      name: item.Name,
      description: item.Description || '',
      price: item.UnitPrice || 0,
      sku: item.Sku || '',
      category: item.ParentRef ? item.ParentRef.name : null
    }));

    res.json({ permits });
  } catch (error) {
    console.error('Error fetching permits:', error);
    res.status(500).json({ 
      error: 'Failed to fetch permits from QuickBooks',
      details: error.message 
    });
  }
};

const createEstimate = async (req, res) => {
  try {
    const { customerInfo, selectedPermits } = req.body;

    // Create a mock quotation object for the service
    const quotationData = {
      first_name: customerInfo.first_name,
      last_name: customerInfo.last_name,
      email: customerInfo.email,
      phone_number: customerInfo.phone_number,
      company_name: customerInfo.company_name,
      description: 'Environmental Consulting Services',
      permit_requests: selectedPermits.map(permit => ({
        permit_type: { time_estimate: permit.price }
      }))
    };

    const result = await quickbooksService.createAndSendEstimate(quotationData);

    res.json({ 
      success: true, 
      estimateId: result.estimateId,
      estimateNumber: result.estimateNumber,
      totalAmount: result.totalAmount,
      customerId: result.customerId
    });

  } catch (error) {
    console.error('Error creating estimate:', error);
    res.status(500).json({ 
      error: 'Failed to create estimate',
      details: error.message 
    });
  }
};

const getTaxRates = async (req, res) => {
  try {
    const taxRates = await quickbooksService.getTaxRates();
    res.json({ taxRates });
  } catch (error) {
    console.error('Error fetching tax rates:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tax rates from QuickBooks',
      details: error.message 
    });
  }
};

const getTaxCodes = async (req, res) => {
  try {
    const taxCodes = await quickbooksService.getTaxCodes();
    res.json({ taxCodes });
  } catch (error) {
    console.error('Error fetching tax codes:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tax codes from QuickBooks',
      details: error.message 
    });
  }
};

const syncPermits = async (req, res) => {
  try {
    const result = await quickbooksService.syncPermitsWithQuickBooks();
    res.json(result);
  } catch (error) {
    console.error('Error syncing permits:', error);
    res.status(500).json({ 
      error: 'Failed to sync permits with QuickBooks',
      details: error.message 
    });
  }
};

module.exports = {
  getAuthUrl,
  handleCallback,
  getConnectionStatus,
  getPermits,
  createEstimate,
  getTaxRates,
  getTaxCodes,
  syncPermits
}; 