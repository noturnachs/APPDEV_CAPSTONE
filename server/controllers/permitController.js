const permitService = require('../services/permitService');

const getAllPermits = async (req, res) => {
  try {
    const result = await permitService.getAllPermits();
    res.json(result);
  } catch (error) {
    console.error('Error fetching permits:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch permits' });
  }
};

const getPermitById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await permitService.getPermitById(id);
    res.json(result);
  } catch (error) {
    console.error('Error fetching permit:', error);
    if (error.message === 'Permit not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to fetch permit' });
    }
  }
};

const getPermitsByAgency = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const permits = await permitService.getPermitsByAgency(agencyId);
    res.json({ permits });
  } catch (error) {
    console.error('Error fetching permits by agency:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch permits by agency' });
  }
};

const createPermit = async (req, res) => {
  try {
    const result = await permitService.createPermit(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating permit:', error);
    res.status(500).json({ error: error.message || 'Failed to create permit' });
  }
};

const updatePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await permitService.updatePermit(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating permit:', error);
    if (error.message === 'Permit not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to update permit' });
    }
  }
};

const deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    await permitService.deletePermit(id);
    res.json({ message: 'Permit deleted successfully' });
  } catch (error) {
    console.error('Error deleting permit:', error);
    if (error.message === 'Permit not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to delete permit' });
    }
  }
};

module.exports = {
  getAllPermits,
  getPermitById,
  getPermitsByAgency,
  createPermit,
  updatePermit,
  deletePermit
}; 