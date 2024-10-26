// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Initial users required by the project specifications
const users = [
  // 2 ADMIN users
  {
    emailAddress: 'admin1@example.com',
    firstName: 'Admin',
    lastName: 'One',
    password: 'admin123',
    role: 'ADMIN'
  },
  {
    emailAddress: 'admin2@example.com',
    firstName: 'Admin',
    lastName: 'Two',
    password: 'admin123',
    role: 'ADMIN'
  },
  // 3 BASIC users
  {
    emailAddress: 'user1@example.com',
    firstName: 'User',
    lastName: 'One',
    password: 'user123',
    role: 'BASIC'
  },
  {
    emailAddress: 'user2@example.com',
    firstName: 'User',
    lastName: 'Two',
    password: 'user123',
    role: 'BASIC'
  },
  {
    emailAddress: 'user3@example.com',
    firstName: 'User',
    lastName: 'Three',
    password: 'user123',
    role: 'BASIC'
  }
];

async function main() {
  console.log('Starting to seed database...');
  
  for (const user of users) {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    // Create the user in the database
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword
      }
    });
  }
  
  console.log('Database seeding completed');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });