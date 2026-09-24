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

// In-memory rate limiting and brute-force protection
const staffAttemptStore = new Map<string, { count: number; lockedUntil: number }>();

// POST /api/auth/staff-login - Dedicated secure staff & seller authentication
authRouter.post('/staff-login', async (req: Request, res: Response) => {
  try {
    const { identifier, passkey, portalRole } = req.body;

    if (!identifier || !passkey) {
      return res.status(400).json({ 
        success: false, 
        message: 'Identifier and security passkey are required.' 
      });
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const cleanPass = String(passkey).trim();
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'client';
    const rateKey = `${clientIp}_${cleanId}`;

    // 1. Check Brute-Force lockout
    const attemptRecord = staffAttemptStore.get(rateKey);
    const now = Date.now();
    if (attemptRecord && attemptRecord.lockedUntil > now) {
      const waitSeconds = Math.ceil((attemptRecord.lockedUntil - now) / 1000);
      return res.status(429).json({
        success: false,
        isLocked: true,
        waitSeconds,
        message: `Security Lockout Active: Too many failed credential attempts. Please retry in ${waitSeconds} seconds.`
      });
    }

    // 2. Strict Positive Credentials Database
    // Admin positive accounts
    const adminIdentifiers = [
      'anik',
      'anik@naxtto.com',
      'baidyaanik18@gmail.com',
      'admin',
      'admin@naxtto.com',
      'atelier@naxtto.com'
    ];
    const adminPasskeys = ['naxtto2026', 'anik', 'admin123'];

    // Seller positive accounts
    const sellerIdentifiers = [
      'seller',
      'seller@naxtto.com',
      'staff',
      'staff@naxtto.com',
      'director',
      'director@naxtto.com',
      'curator@naxtto.com',
      'artisan@naxtto.com',
      'supplier',
      'supplier@naxtto.com'
    ];
    const sellerPasskeys = ['naxtto2026', 'seller123', 'staff123', 'director750', 'atelier2026'];

    const isAdminMatch = adminIdentifiers.includes(cleanId) && adminPasskeys.includes(cleanPass);
    const isSellerMatch = sellerIdentifiers.includes(cleanId) && sellerPasskeys.includes(cleanPass);

    // If portal role is specifically requested, enforce matching
    const roleMismatch = (portalRole === 'admin' && !isAdminMatch) || (portalRole === 'seller' && !isSellerMatch && !isAdminMatch);

    if ((isAdminMatch || isSellerMatch) && !roleMismatch) {
      // Clear attempt record on success
      staffAttemptStore.delete(rateKey);

      const isDirector = cleanId.includes('director');
      const resolvedRole = isAdminMatch 
        ? 'Atelier Administrator' 
        : (isDirector ? 'Atelier Director' : 'Certified Atelier Seller');
      
      const resolvedName = isAdminMatch 
        ? 'Anik (Administrator)' 
        : (cleanId.includes('@') ? cleanId.split('@')[0].toUpperCase() : cleanId.toUpperCase());

      const resolvedEmail = cleanId.includes('@') ? cleanId : `${cleanId}@naxtto.com`;

      return res.json({
        success: true,
        role: isAdminMatch ? 'admin' : 'seller',
        staff: {
          name: resolvedName,
          email: resolvedEmail,
          role: resolvedRole
        },
        message: `Credentials verified. Welcome to ${resolvedRole} Suite.`,
        token: `staff_jwt_${Date.now()}`
      });
    }

    // 3. Handle Negative Credential Attempt (Security Rejection)
    const currentAttempts = (attemptRecord?.count || 0) + 1;
    let lockedUntil = 0;
    const maxAttempts = 4;

    if (currentAttempts >= maxAttempts) {
      lockedUntil = now + 30000; // 30 seconds lockout
    }

    staffAttemptStore.set(rateKey, { count: currentAttempts, lockedUntil });

    const remainingAttempts = Math.max(0, maxAttempts - currentAttempts);

    return res.status(401).json({
      success: false,
      remainingAttempts,
      isLocked: lockedUntil > 0,
      waitSeconds: lockedUntil > 0 ? 30 : 0,
      message: lockedUntil > 0 
        ? 'Security Lockout: 4 failed attempts detected. Access suspended for 30 seconds.' 
        : `Access Denied: Invalid security credentials. Negative authentication rejected (${remainingAttempts} attempts remaining before lockout).`
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Staff authentication service error.' 
    });
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

// In-memory persistent stores for Platform Users and Sellers (with realistic default seed data)
let platformUsersStore = [
  {
    id: 'usr-anik-admin',
    name: 'Anik Baidya (Admin)',
    email: 'baidyaanik18@gmail.com',
    phone: '+91 98310 99999',
    memberTier: 'VIP Privé',
    status: 'vip',
    createdAt: '2023-01-15T10:00:00.000Z',
    lastActiveAt: new Date().toISOString(),
    ordersCount: 0,
    totalSpent: 0,
    savedAddressesCount: 1,
    cartItemsCount: 0,
    wishlistItemsCount: 0,
    notes: 'Platform Founder & Executive Administrator',
    savedAddresses: [
      {
        fullName: 'Anik Baidya',
        addressLine1: '75B Park Street, Camac St Commercial District',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700016',
        country: 'India',
        phone: '+91 98310 99999',
        isDefault: true
      }
    ]
  }
];

let platformSellersStore: any[] = [];

// GET /api/auth/users - Admin User Directory endpoint
authRouter.get('/users', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      count: platformUsersStore.length,
      users: platformUsersStore
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/auth/users/:id - Admin User update endpoint
authRouter.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userIndex = platformUsersStore.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    platformUsersStore[userIndex] = {
      ...platformUsersStore[userIndex],
      ...updates
    };

    res.json({
      success: true,
      message: 'User updated successfully',
      user: platformUsersStore[userIndex]
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/sellers - Admin Seller Directory endpoint
authRouter.get('/sellers', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      count: platformSellersStore.length,
      sellers: platformSellersStore
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/sellers - Register / Add new seller account
authRouter.post('/sellers', async (req: Request, res: Response) => {
  try {
    const { storeName, ownerName, email, phone, city, commissionRate, gstNumber, workshopAddress } = req.body;

    if (!storeName || !email) {
      return res.status(400).json({ success: false, message: 'Store name and email are required' });
    }

    const newSeller = {
      id: `seller-${Date.now()}`,
      storeName,
      ownerName: ownerName || 'Certified Artisan',
      email,
      phone: phone || '+91 90000 00000',
      status: 'verified',
      badge: 'Certified Seller',
      city: city || 'Kolkata, WB',
      rating: 5.0,
      totalProducts: 0,
      totalOrdersFulfilled: 0,
      totalRevenue: 0,
      commissionRate: commissionRate !== undefined ? Number(commissionRate) : 8.0,
      gstNumber: gstNumber || 'Pending GSTIN',
      joinedDate: new Date().toISOString().split('T')[0],
      workshopAddress: workshopAddress || 'Registered Workshop, West Bengal',
      bankAccountLast4: '0000'
    };

    platformSellersStore.unshift(newSeller);

    res.json({
      success: true,
      message: 'New seller onboarded successfully',
      seller: newSeller
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/auth/sellers/:id - Update seller account status or commission
authRouter.patch('/sellers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const sellerIndex = platformSellersStore.findIndex(s => s.id === id);
    if (sellerIndex === -1) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    platformSellersStore[sellerIndex] = {
      ...platformSellersStore[sellerIndex],
      ...updates
    };

    res.json({
      success: true,
      message: 'Seller status updated successfully',
      seller: platformSellersStore[sellerIndex]
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

