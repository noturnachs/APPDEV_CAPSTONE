const prisma = require('../config/database');

class PermitRequestRepository {
  async create(data, transaction = null) {
    // Ensure quotation_id is parsed as integer
    const processedData = {
      ...data,
      quotation_id: parseInt(data.quotation_id),
      permit_type_id: data.permit_type_id ? parseInt(data.permit_type_id) : null
    };
    
    const options = { data: processedData };
    
    if (transaction) {
      options.transaction = transaction;
    }
    
    return await prisma.permit_request.create(options);
  }

  async findById(id) {
    return await prisma.permit_request.findUnique({
      where: { id: parseInt(id) },
      include: {
        permit_type: {
          include: {
            agency: true
          }
        },
        quotation: true
      }
    });
  }

  async findByQuotationId(quotationId) {
    return await prisma.permit_request.findMany({
      where: { quotation_id: parseInt(quotationId) },
      include: {
        permit_type: {
          include: {
            agency: true
          }
        }
      }
    });
  }

  async update(id, data) {
    return await prisma.permit_request.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async delete(id) {
    return await prisma.permit_request.delete({
      where: { id: parseInt(id) }
    });
  }

  async deleteByQuotationId(quotationId, transaction = null) {
    const options = {
      where: { quotation_id: parseInt(quotationId) }
    };
    
    if (transaction) {
      options.transaction = transaction;
    }
    
    return await prisma.permit_request.deleteMany(options);
  }
}

module.exports = new PermitRequestRepository(); 