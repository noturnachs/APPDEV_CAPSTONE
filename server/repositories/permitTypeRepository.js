const prisma = require('../config/database');

class PermitTypeRepository {
  async create(data) {
    return await prisma.permit_type.create({ data });
  }

  async findById(id, include = {}) {
    return await prisma.permit_type.findUnique({
      where: { id: parseInt(id) },
      include
    });
  }

  async findByNameAndAgency(name, agencyId) {
    return await prisma.permit_type.findFirst({
      where: { 
        name,
        agency_id: parseInt(agencyId)
      }
    });
  }

  async findAll(options = {}) {
    const { include = { agency: true }, orderBy = { name: 'asc' } } = options;
    return await prisma.permit_type.findMany({
      include,
      orderBy
    });
  }

  async findByAgencyId(agencyId) {
    return await prisma.permit_type.findMany({
      where: { agency_id: parseInt(agencyId) },
      include: { agency: true },
      orderBy: { name: 'asc' }
    });
  }

  async update(id, data) {
    return await prisma.permit_type.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async delete(id) {
    return await prisma.permit_type.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new PermitTypeRepository(); 