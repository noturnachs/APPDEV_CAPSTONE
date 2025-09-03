const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Clean up
  await prisma.permit_type.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.staff.deleteMany();

  // Hash passwords for production-level security
  const managerPassword = await bcrypt.hash("password123", 12);
  const adminPassword = await bcrypt.hash("admin123", 12);
  const employeePassword = await bcrypt.hash("employee123", 12);

  // Seed staff (manager account)
  await prisma.staff.create({
    data: {
      email: "manager@alphasystems.com",
      password: managerPassword,
      first_name: "John",
      last_name: "Manager",
      role: "manager",
      is_active: true
    }
  });

  // Seed admin account
  await prisma.staff.create({
    data: {
      email: "admin@alphasystems.com",
      password: adminPassword,
      first_name: "Admin",
      last_name: "User",
      role: "admin",
      is_active: true
    }
  });

  // Seed employee accounts
  await prisma.staff.create({
    data: {
      email: "employee@alphasystems.com",
      password: employeePassword,
      first_name: "Sarah",
      last_name: "Johnson",
      role: "employee",
      is_active: true
    }
  });

  await prisma.staff.create({
    data: {
      email: "mike.chen@alphasystems.com",
      password: employeePassword,
      first_name: "Mike",
      last_name: "Chen",
      role: "employee",
      is_active: true
    }
  });

  await prisma.staff.create({
    data: {
      email: "lisa.garcia@alphasystems.com",
      password: employeePassword,
      first_name: "Lisa",
      last_name: "Garcia",
      role: "employee",
      is_active: true
    }
  });

  await prisma.staff.create({
    data: {
      email: "david.kim@alphasystems.com",
      password: employeePassword,
      first_name: "David",
      last_name: "Kim",
      role: "employee",
      is_active: true
    }
  });

  // Seed agencies and permits matching your QuickBooks data
  await prisma.agency.create({
    data: {
      name: "City Hall",
      permit_types: {
        create: [
          { 
            name: "Building Permit", 
            quickbooks_item_id: "29", 
            price: 5000,
            time_estimate: "2-3 months",
            description: "Required for construction projects"
          },
          { 
            name: "Business Permit", 
            quickbooks_item_id: "31", 
            price: 2500,
            time_estimate: "2-3 weeks",
            description: "Required for business operations"
          },
        ]
      }
    }
  });

  await prisma.agency.create({
    data: {
      name: "DENR",
      permit_types: {
        create: [
          { 
            name: "Environmental Clearance", 
            quickbooks_item_id: "33", 
            price: 2200,
            time_estimate: "3-4 months",
            description: "Environmental impact assessment required"
          }
        ]
      }
    }
  });

  await prisma.agency.create({
    data: {
      name: "BFP",
      permit_types: {
        create: [
          { 
            name: "Fire Safety Inspection", 
            quickbooks_item_id: "32", 
            price: 1200,
            time_estimate: "1-2 weeks",
            description: "Fire safety compliance check"
          }
        ]
      }
    }
  });

  await prisma.agency.create({
    data: {
      name: "DOH",
      permit_types: {
        create: [
          { 
            name: "Health Permit", 
            quickbooks_item_id: "30", 
            price: 1800,
            time_estimate: "2-3 weeks",
            description: "Health and safety compliance"
          }
        ]
      }
    }
  });

  console.log('Seeded staff accounts, agencies and permits!');
  console.log('Manager login: manager@alphasystems.com / password123');
  console.log('Admin login: admin@alphasystems.com / admin123');
  console.log('Employee logins:');
  console.log('  - employee@alphasystems.com / employee123');
  console.log('  - mike.chen@alphasystems.com / employee123');
  console.log('  - lisa.garcia@alphasystems.com / employee123');
  console.log('  - david.kim@alphasystems.com / employee123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });