import { Router, Request, Response } from 'express';
import { adminAuth } from '../../src/lib/firebase-admin';
import { upsertUserInDb } from '../../src/db/helpers';

export const authRouter = Router();

// POST /api/auth/verify-token - Verifies Firebase ID Token and upserts user in Cloud SQL
authRouter.post('/verify-token', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'idToken is required' });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const dbUser = await upsertUserInDb({
      id: decodedToken.uid,
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Patron',
      email: decodedToken.email || '',
      avatar: decodedToken.picture || undefined,
      memberTier: 'NaxtTo Circle'
    });

    res.json({
      success: true,
      user: dbUser,
      decoded: decodedToken
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(401).json({ success: false, message: error.message || 'Invalid Firebase token' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Admin authentication check (username: anik, password: anik)
    const isAdminIdentifier = 
      cleanEmail === 'anik' ||
      cleanEmail === 'anik@naxtto.com' ||
      cleanEmail === 'baidyaanik18@gmail.com' ||
      cleanEmail === 'admin' ||
      cleanEmail === 'admin@naxtto.com' ||
      cleanEmail === 'atelier@naxtto.com';

    if (isAdminIdentifier) {
      if (cleanPassword === 'anik' || cleanPassword === 'admin123' || cleanPassword === 'naxtto2026') {
        return res.json({
          success: true,
          role: 'admin',
          message: 'Welcome back Anik, Atelier Administrator Console unlocked.',
          token: `admin_jwt_${Date.now()}`,
          user: {
            name: 'Anik (Atelier Administrator)',
            email: cleanEmail === 'anik' ? 'anik@naxtto.com' : cleanEmail,
            role: 'admin'
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid password. For Admin access use username: anik, password: anik'
        });
      }
    }

    // Upsert patron in database
    const dbUser = await upsertUserInDb({
      id: `patron-${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      memberTier: 'NaxtTo Circle'
    });

    return res.json({
      success: true,
      role: 'patron',
      message: 'Signed in successfully',
      token: `patron_jwt_${Date.now()}`,
      user: dbUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Authentication failed' });
  }
});

// POST /api/auth/sync-user
authRouter.post('/sync-user', async (req: Request, res: Response) => {
  try {
    const { id, name, email, avatar, memberTier } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await upsertUserInDb({
      id: id || `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      avatar,
      memberTier
    });

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Sync failed' });
  }
});
