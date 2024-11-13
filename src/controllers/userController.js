import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        emailAddress: true,
        firstName: true,
        lastName: true,
        role: true,
        loginAttempts: true,
        lastLoginAttempt: true
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getAllUsers;