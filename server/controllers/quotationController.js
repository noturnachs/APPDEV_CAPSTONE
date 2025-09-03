const quotationService = require('../services/quotationService');
const { validateQuotationData, validateId, ValidationError, BusinessLogicError, NotFoundError } = require('../utils/validation');

const createQuotation = async (req, res) => {
  try {
    validateQuotationData(req.body);
    const result = await quotationService.createQuotation(req.body);
    
    if (result.quickbooksError) {
      console.warn('QuickBooks integration warning:', result.quickbooksError);
      res.status(201).json({
        success: true,
        quotation: result.quotation,
        message: 'Quotation created successfully (QuickBooks estimate creation failed)',
        warning: result.quickbooksError
      });
    } else {
      console.log('QuickBooks estimate created:', result.quickbooksEstimate.estimateId);
      res.status(201).json({
        success: true,
        quotation: result.quotation,
        quickbooksEstimate: result.quickbooksEstimate,
        message: 'Quotation created successfully with QuickBooks estimate'
      });
    }
  } catch (error) {
    console.error('Error creating quotation:', error);
    
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to create quotation' });
    }
  }
};

const sendQuotation = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'quotation ID');
    const result = await quotationService.sendQuotation(id);
    
    console.log('📧 Quotation sent successfully to:', result.sentTo);
    console.log('🔗 QuickBooks estimate ID:', result.estimateId);
    
    res.json({
      success: true,
      message: 'Quotation sent successfully to client',
      estimateId: result.estimateId,
      sentTo: result.sentTo
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

const getAllQuotations = async (req, res) => {
  try {
    const quotations = await quotationService.getAllQuotations();
    res.json({ quotations });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch quotations' });
  }
};

const getQuotationById = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'quotation ID');
    const quotation = await quotationService.getQuotationById(id);
    res.json({ quotation });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to fetch quotation' });
    }
  }
};

const updateQuotation = async (req, res) => {
  try {
    console.log('PUT /api/quotations/:id called');
    console.log('Request method:', req.method);
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    
    const id = validateId(req.params.id, 'quotation ID');
    const quotation = await quotationService.updateQuotation(id, req.body);
    
    console.log('✅ Quotation updated successfully:', id);
    res.json({ quotation });
  } catch (error) {
    console.error('Error updating quotation:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to update quotation' });
    }
  }
};

const deleteQuotation = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'quotation ID');
    await quotationService.deleteQuotation(id);
    
    console.log('🗑️ Quotation deleted successfully:', id);
    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to delete quotation' });
    }
  }
};

// Add permit to quotation
const addPermitToQuotation = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'quotation ID');
    const { permit_type_id } = req.body;
    
    // Validate that permit_type_id is provided (no custom permits allowed)
    if (!permit_type_id) {
      return res.status(400).json({ 
        error: 'Only predefined permits can be added. Please provide a valid permit_type_id.' 
      });
    }
    
    const result = await quotationService.addPermitToQuotation(id, {
      permit_type_id: permit_type_id,
      custom_name: null // Always null for predefined permits
    });
    
    console.log('✅ Permit added to quotation:', id, 'permit_type:', permit_type_id);
    res.json({ quotation: result });
  } catch (error) {
    console.error('Error adding permit to quotation:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof BusinessLogicError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to add permit to quotation' });
    }
  }
};

// Remove permit from quotation
const removePermitFromQuotation = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'quotation ID');
    const permitId = validateId(req.params.permitId, 'permit ID');
    
    const result = await quotationService.removePermitFromQuotation(id, permitId);
    
    console.log('🗑️ Permit removed from quotation:', id, 'permit:', permitId);
    res.json({ quotation: result });
  } catch (error) {
    console.error('Error removing permit from quotation:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to remove permit from quotation' });
    }
  }
};

// Get available permits for quotation
const getAvailablePermits = async (req, res) => {
  try {
    const permits = await quotationService.getAvailablePermits();
    res.json({ agencies: permits });
  } catch (error) {
    console.error('Error fetching available permits:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch available permits' });
  }
};

// Get quotation permits
const getQuotationPermits = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'quotation ID');
    const permits = await quotationService.getQuotationPermits(id);
    res.json({ permits });
  } catch (error) {
    console.error('Error fetching quotation permits:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to fetch quotation permits' });
    }
  }
};

module.exports = {
  createQuotation,
  sendQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  addPermitToQuotation,
  removePermitFromQuotation,
  getAvailablePermits,
  getQuotationPermits
}; 