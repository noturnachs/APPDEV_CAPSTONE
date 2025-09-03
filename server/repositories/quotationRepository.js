const prisma = require('../config/database');

class QuotationRepository {
  async create(data) {
    return await prisma.quotation.create({ data });
  }

  async findById(id, include = {}) {
    return await prisma.quotation.findUnique({
      where: { id: parseInt(id) },
      include
    });
  }

  async findAll(options = {}) {
    const { include = {}, orderBy = { created_at: 'desc' } } = options;
    return await prisma.quotation.findMany({
      include,
      orderBy
    });
  }

  async update(id, data, transaction = null) {
    const options = {
      where: { id: parseInt(id) },
      data
    };
    
    if (transaction) {
      options.transaction = transaction;
    }
    
    return await prisma.quotation.update(options);
  }

  async startTransaction() {
    return await prisma.$transaction;
  }

  async delete(id) {
    return await prisma.quotation.delete({
      where: { id: parseInt(id) }
    });
  }

  async findWithPermitRequests(id) {
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Invalid quotation ID provided');
    }
    
    return await prisma.quotation.findUnique({
      where: { id: parseInt(id) },
      include: {
        permit_requests: {
          include: {
            permit_type: {
              include: {
                agency: true
              }
            }
          }
        },
        client: true
      }
    });
  }

  async findWithPermitRequestsAndProject(id) {
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Invalid quotation ID provided');
    }
    
    return await prisma.quotation.findUnique({
      where: { id: parseInt(id) },
      include: {
        permit_requests: {
          include: {
            permit_type: {
              include: {
                agency: true
              }
            }
          }
        },
        project: true,
        client: true
      }
    });
  }

  async findWithQuickBooksData(id) {
    return await prisma.quotation.findUnique({
      where: { id: parseInt(id) },
      include: {
        permit_requests: {
          include: {
            permit_type: {
              include: {
                agency: true
              }
            }
          }
        },
        project: true,
        client: true,
        assigned_manager: true
      }
    });
  }
}

module.exports = new QuotationRepository(); 