const permitTypeRepository = require('../repositories/permitTypeRepository');

class PermitService {
  // Get all permit types with agency information
  async getAllPermits() {
    return await permitTypeRepository.findAll();
  }

  // Get permit by ID with agency information
  async getPermitById(id) {
    const permit = await permitTypeRepository.findById(id, { agency: true });
    
    if (!permit) {
      throw new Error('Permit not found');
    }

    return { permit };
  }

  // Get permits by agency ID
  async getPermitsByAgency(agencyId) {
    return await permitTypeRepository.findByAgencyId(agencyId);
  }

  // Create new permit type
  async createPermit(permitData) {
    const permit = await permitTypeRepository.create(permitData);
    return { permit };
  }

  // Update permit type
  async updatePermit(id, permitData) {
    const existingPermit = await permitTypeRepository.findById(id);
    
    if (!existingPermit) {
      throw new Error('Permit not found');
    }

    const permit = await permitTypeRepository.update(id, permitData);
    return { permit };
  }

  // Delete permit type
  async deletePermit(id) {
    const permit = await permitTypeRepository.findById(id);
    
    if (!permit) {
      throw new Error('Permit not found');
    }

    return await permitTypeRepository.delete(id);
  }
}

module.exports = new PermitService(); 