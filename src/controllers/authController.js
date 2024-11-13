import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../validation/schemas.js';

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { emailAddress, firstName, lastName, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { emailAddress }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        emailAddress,
        firstName,
        lastName,
        password: hashedPassword,
        role: 'BASIC'
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { emailAddress, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { emailAddress }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.loginAttempts >= 3 && user.lastLoginAttempt) {
      const lockoutTime = new Date(user.lastLoginAttempt.getTime() + 15 * 60000);
      if (lockoutTime > new Date()) {
        return res.status(429).json({ error: 'Account temporarily locked. Try again later.' });
      }
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: user.loginAttempts + 1,
          lastLoginAttempt: new Date()
        }
      });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lastLoginAttempt: null
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { register, login };