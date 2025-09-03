const prisma = require('../config/database');

class AgencyRepository {
  async create(data) {
    return await prisma.agency.create({ data });
  }

  async findById(id, include = {}) {
    return await prisma.agency.findUnique({
      where: { id: parseInt(id) },
      include
    });
  }

  async findByName(name) {
    return await prisma.agency.findFirst({
      where: { name }
    });
  }

  async findAll(options = {}) {
    const { include = { permit_types: true }, orderBy = { name: 'asc' } } = options;
    return await prisma.agency.findMany({
      include,
      orderBy
    });
  }

  async update(id, data) {
    return await prisma.agency.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async delete(id) {
    return await prisma.agency.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new AgencyRepository(); 