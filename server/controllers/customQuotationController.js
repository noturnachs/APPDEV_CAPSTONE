const customQuotationService = require('../services/customQuotationService');
const { validateId, ValidationError, BusinessLogicError, NotFoundError } = require('../utils/validation');

/**
 * Send quotation via custom email service
 */
const sendQuotation = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'quotation ID');
    const result = await customQuotationService.sendQuotation(id);
    
    console.log('📧 Quotation sent successfully via custom email service to:', result.sentTo);
    console.log('🔗 Message ID:', result.messageId);
    
    res.json({
      success: true,
      message: 'Quotation sent successfully to client',
      estimateId: result.estimateId,
      sentTo: result.sentTo,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending quotation:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof BusinessLogicError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to send quotation' });
    }
  }
};

/**
 * Handle quotation response (approve/decline)
 */
const handleQuotationResponse = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const result = await customQuotationService.handleQuotationResponse(token);
    
    console.log(`✅ Quotation #${result.quotationId} ${result.action}d by client`);
    
    res.json({
      success: true,
      message: `Quotation ${result.action}d successfully`,
      quotationId: result.quotationId,
      status: result.newStatus
    });
  } catch (error) {
    console.error('Error handling quotation response:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof BusinessLogicError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to process quotation response' });
    }
  }
};

/**
 * Verify quotation response token (for client-side validation)
 */
const verifyResponseToken = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'quotation-action-secret';
    
    // Verify token without updating anything
    const decoded = jwt.verify(token, secret);
    
    // Extract quotation ID and action
    const { quotationId, action } = decoded;
    
    if (!quotationId || !action || (action !== 'approve' && action !== 'decline')) {
      return res.status(400).json({ error: 'Invalid token data' });
    }
    
    // Find the quotation with all details including permits
    const quotationRepository = require('../repositories/quotationRepository');
    const quotation = await quotationRepository.findWithPermitRequestsAndProject(quotationId);
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    res.json({
      success: true,
      quotationId,
      action,
      quotation: {
        id: quotation.id,
        company_name: quotation.company_name,
        first_name: quotation.first_name,
        last_name: quotation.last_name,
        email: quotation.email,
        phone_number: quotation.phone_number,
        service_type: quotation.service_type,
        description: quotation.description,
        status: quotation.status,
        quickbooks_estimate_id: quotation.quickbooks_estimate_id,
        quickbooks_estimate_amount: quotation.quickbooks_estimate_amount,
        created_at: quotation.created_at,
        permit_requests: quotation.permit_requests || [],
        project: quotation.project || null
      }
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    
    if (error.name === 'JsonWebTokenError') {
      res.status(400).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      res.status(400).json({ error: 'Token expired' });
    } else {
      res.status(500).json({ error: error.message || 'Failed to verify token' });
    }
  }
};

/**
 * Generate and serve PDF for quotation
 */
const getQuotationPDF = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'quotation ID');
    
    // Find the quotation with all details including permits
    const quotationRepository = require('../repositories/quotationRepository');
    const quotation = await quotationRepository.findWithPermitRequestsAndProject(id);
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    // Get estimate data from QuickBooks if available
    let estimateData = null;
    const quickbooksService = require('../services/quickbooksService');
    
    if (quotation.quickbooks_estimate_id) {
      try {
        await quickbooksService.ensureValidToken();
        
        // Use the getEstimate method to fetch the estimate details
        estimateData = await new Promise((resolve, reject) => {
          quickbooksService.qbo.getEstimate(quotation.quickbooks_estimate_id, (err, estimate) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(estimate);
          });
        });
      } catch (error) {
        console.warn('Warning: Could not fetch QuickBooks estimate details:', error.message);
        // Continue without QuickBooks data
      }
    }
    
    // Generate PDF using the email service's PDF generator
    const emailService = require('../utils/emailService');
    const pdfPath = await emailService.generateQuotationPDF(quotation, estimateData);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Alpha_Systems_Quotation_${quotation.id}.pdf"`);
    
    // Stream the file to the response
    const fs = require('fs');
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
    
    // Clean up the file after sending
    fileStream.on('end', () => {
      fs.unlinkSync(pdfPath);
    });
    
  } catch (error) {
    console.error('Error generating quotation PDF:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to generate quotation PDF' });
    }
  }
};

module.exports = {
  sendQuotation,
  handleQuotationResponse,
  verifyResponseToken,
  getQuotationPDF
};
