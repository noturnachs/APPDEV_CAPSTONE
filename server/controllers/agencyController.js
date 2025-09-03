const agencyService = require('../services/agencyService');
const { validateId, ValidationError, NotFoundError } = require('../utils/validation');

const getAllAgencies = async (req, res) => {
  try {
    const agencies = await agencyService.getAllAgencies();
    res.json({ agencies });
  } catch (error) {
    console.error('Error fetching agencies:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch agencies' });
  }
};

const getAgencyById = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'agency ID');
    const agency = await agencyService.getAgencyById(id);
    res.json({ agency });
  } catch (error) {
    console.error('Error fetching agency:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to fetch agency' });
    }
  }
};

const createAgency = async (req, res) => {
  try {
    const agency = await agencyService.createAgency(req.body);
    
    console.log('✅ Agency created successfully:', agency.name);
    res.status(201).json({ agency });
  } catch (error) {
    console.error('Error creating agency:', error);
    res.status(500).json({ error: error.message || 'Failed to create agency' });
  }
};

const updateAgency = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'agency ID');
    const agency = await agencyService.updateAgency(id, req.body);
    
    console.log('✅ Agency updated successfully:', id);
    res.json({ agency });
  } catch (error) {
    console.error('Error updating agency:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to update agency' });
    }
  }
};

const deleteAgency = async (req, res) => {
  try {
    const id = validateId(req.params.id, 'agency ID');
    await agencyService.deleteAgency(id);
    
    console.log('🗑️ Agency deleted successfully:', id);
    res.json({ message: 'Agency deleted successfully' });
  } catch (error) {
    console.error('Error deleting agency:', error);
    
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, field: error.field });
    } else {
      res.status(500).json({ error: error.message || 'Failed to delete agency' });
    }
  }
};

module.exports = {
  getAllAgencies,
  getAgencyById,
  createAgency,
  updateAgency,
  deleteAgency
}; 