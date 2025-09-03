const prisma = require('../config/database');

class QuickBooksTokensRepository {
  async create(data) {
    return await prisma.quickbooks_tokens.create({ data });
  }

  async findLatest() {
    return await prisma.quickbooks_tokens.findFirst({
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.quickbooks_tokens.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async findAll() {
    return await prisma.quickbooks_tokens.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async update(id, data) {
    return await prisma.quickbooks_tokens.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async delete(id) {
    return await prisma.quickbooks_tokens.delete({
      where: { id: parseInt(id) }
    });
  }

  async deleteAll() {
    return await prisma.quickbooks_tokens.deleteMany({});
  }
}

module.exports = new QuickBooksTokensRepository(); 