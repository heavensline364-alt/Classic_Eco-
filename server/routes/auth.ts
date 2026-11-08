import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB, saveDB } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'classic_eco_super_secret_jwt_key_2026';

export function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

export function verifyAdmin(req: any, res: any, next: any) {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
    }
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, businessName, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and password are required.' });
    }

    const db = getDB();
    const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: 'customer',
      businessName: businessName || '',
      address: address || '',
      isBlocked: false,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: userWithoutPass
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server registration error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const db = getDB();
    const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = user;
    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userWithoutPass
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Login error.' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, (req: any, res) => {
  const db = getDB();
  const user = db.users.find((u: any) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  const { password: _, ...userWithoutPass } = user;
  return res.json({ success: true, user: userWithoutPass });
});

// PUT /api/auth/profile
router.put('/profile', verifyToken, async (req: any, res) => {
  const db = getDB();
  const userIndex = db.users.findIndex((u: any) => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { name, phone, businessName, address, currentPassword, newPassword } = req.body;
  const user = db.users[userIndex];

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required to set a new password.' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (businessName !== undefined) user.businessName = businessName;
  if (address !== undefined) user.address = address;

  saveDB();

  const { password: _, ...userWithoutPass } = user;
  return res.json({ success: true, message: 'Profile updated successfully.', user: userWithoutPass });
});

export default router;
