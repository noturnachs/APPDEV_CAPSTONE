const quotationRepository = require('../repositories/quotationRepository');
const quickbooksService = require('./quickbooksService');
const emailService = require('../utils/emailService');
const { NotFoundError, BusinessLogicError } = require('../utils/validation');

class CustomQuotationService {
  /**
   * Send quotation via custom email service with approval/decline buttons
   * @param {number} id - The quotation ID
   * @returns {Promise<Object>} - Result of sending operation
   */
  async sendQuotation(id) {
    // Find the quotation
    const quotation = await quotationRepository.findById(id);
    
    if (!quotation) {
      throw new NotFoundError('Quotation not found');
    }

    // Check if already sent
    if (quotation.status === 'sent') {
      throw new BusinessLogicError('This quotation has already been sent to the client.');
    }

    let estimateData = null;

    // If QuickBooks estimate exists, fetch it
    if (quotation.quickbooks_estimate_id) {
      try {
        // Get estimate data from QuickBooks
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
        // Continue without QuickBooks data - we'll use our local data instead
      }
    }

    // Get complete quotation with permit requests and project
    const completeQuotation = await quotationRepository.findWithPermitRequestsAndProject(id);

    // Send email with our custom service
    const emailResult = await emailService.sendQuotationEmail(completeQuotation, estimateData);

    // Update quotation status to sent
    await quotationRepository.update(id, { 
      status: 'sent',
      is_synced: true,
      synced_at: new Date()
    });

    // If QuickBooks estimate exists, mark it as sent in QuickBooks too
    let quickbooksResult = null;
    if (quotation.quickbooks_estimate_id) {
      try {
        quickbooksResult = await quickbooksService.markEstimateAsSent(quotation.quickbooks_estimate_id);
        console.log('✅ QuickBooks estimate marked as sent:', quickbooksResult);
      } catch (error) {
        console.warn('Warning: Could not update QuickBooks estimate status:', error.message);
        // Continue even if QuickBooks update fails
      }
    }

    return {
      estimateId: quotation.quickbooks_estimate_id,
      sentTo: emailResult.sentTo,
      messageId: emailResult.messageId,
      quickbooksSync: quickbooksResult ? true : false
    };
  }

  /**
   * Handle quotation response (approve/decline)
   * @param {string} token - The action token
   * @returns {Promise<Object>} - Result of the operation
   */
  async handleQuotationResponse(token) {
    try {
      const jwt = require('jsonwebtoken');
      const secret = process.env.JWT_SECRET || 'quotation-action-secret';
      
      // Verify and decode the token
      const decoded = jwt.verify(token, secret);
      
      // Extract quotation ID and action
      const { quotationId, action } = decoded;
      
      if (!quotationId || !action || (action !== 'approve' && action !== 'decline')) {
        throw new BusinessLogicError('Invalid token data');
      }
      
      // Find the quotation
      const quotation = await quotationRepository.findById(quotationId);
      
      if (!quotation) {
        throw new NotFoundError('Quotation not found');
      }
      
      // Update status based on action
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // Update quotation status
      await quotationRepository.update(quotationId, { 
        status: newStatus,
        // Using approved_at field instead of responded_at since it exists in the database
        approved_at: new Date()
      });
      
      // If QuickBooks estimate exists, update its status too
      let quickbooksResult = null;
      if (quotation.quickbooks_estimate_id) {
        try {
          quickbooksResult = await quickbooksService.updateEstimateStatus(
            quotation.quickbooks_estimate_id, 
            action
          );
          console.log(`✅ QuickBooks estimate marked as ${action}ed:`, quickbooksResult);
        } catch (error) {
          console.warn(`Warning: Could not update QuickBooks estimate status to ${action}:`, error.message);
          // Continue even if QuickBooks update fails
        }
      }
      
      return {
        success: true,
        quotationId,
        action,
        newStatus,
        quickbooksSync: quickbooksResult ? true : false
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new BusinessLogicError('Invalid or expired token');
      }
      throw error;
    }
  }
}

module.exports = new CustomQuotationService();
