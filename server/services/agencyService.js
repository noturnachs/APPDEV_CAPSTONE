const agencyRepository = require('../repositories/agencyRepository');
const { NotFoundError } = require('../utils/validation');

class AgencyService {
  // Get all agencies with permit types
  async getAllAgencies() {
    return await agencyRepository.findAll();
  }

  // Get agency by ID with permit types
  async getAgencyById(id) {
    const agency = await agencyRepository.findById(id, { permit_types: true });
    
    if (!agency) {
      throw new NotFoundError('Agency not found');
    }

    return agency;
  }

  // Get agency by name
  async getAgencyByName(name) {
    const agency = await agencyRepository.findByName(name);
    
    if (!agency) {
      throw new NotFoundError('Agency not found');
    }

    return agency;
  }

  // Create new agency
  async createAgency(agencyData) {
    const agency = await agencyRepository.create(agencyData);
    return agency;
  }

  // Update agency
  async updateAgency(id, agencyData) {
    const existingAgency = await agencyRepository.findById(id);
    
    if (!existingAgency) {
      throw new NotFoundError('Agency not found');
    }

    const agency = await agencyRepository.update(id, agencyData);
    return agency;
  }

  // Delete agency
  async deleteAgency(id) {
    const agency = await agencyRepository.findById(id);
    
    if (!agency) {
      throw new NotFoundError('Agency not found');
    }

    return await agencyRepository.delete(id);
  }
}

module.exports = new AgencyService(); 