const prisma = require('../config/database');

class StaffRepository {
  async create(data) {
    return await prisma.staff.create({ data });
  }

  async findById(id, select = {}) {
    return await prisma.staff.findUnique({
      where: { id: parseInt(id) },
      select
    });
  }

  async findByEmail(email) {
    return await prisma.staff.findUnique({
      where: { email: email.toLowerCase() }
    });
  }

  async findAll(options = {}) {
    const { 
      select = {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        created_at: true
      }, 
      orderBy = { created_at: 'desc' } 
    } = options;
    
    return await prisma.staff.findMany({
      select,
      orderBy
    });
  }

  async update(id, data) {
    return await prisma.staff.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async delete(id) {
    return await prisma.staff.delete({
      where: { id: parseInt(id) }
    });
  }

  async findActiveStaff() {
    return await prisma.staff.findMany({
      where: { is_active: true },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true
      },
      orderBy: { created_at: 'desc' }
    });
  }
}

module.exports = new StaffRepository(); 