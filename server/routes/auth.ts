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
    ordersCount: 8,
    totalSpent: 184500,
    savedAddressesCount: 2,
    cartItemsCount: 2,
    wishlistItemsCount: 5,
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
  },
  {
    id: 'usr-sreeja',
    name: 'Sreeja Chatterjee',
    email: 'sreeja.chatterjee@gmail.com',
    phone: '+91 98305 11223',
    memberTier: 'VIP Privé',
    status: 'vip',
    createdAt: '2024-02-10T14:32:00.000Z',
    lastActiveAt: '2026-09-17T18:40:00.000Z',
    ordersCount: 4,
    totalSpent: 84999,
    savedAddressesCount: 2,
    cartItemsCount: 1,
    wishlistItemsCount: 4,
    notes: 'Bridal Heritage VIP connoisseur. Highly active in wedding collections.',
    savedAddresses: [
      {
        fullName: 'Sreeja Chatterjee',
        addressLine1: 'Tower 3, Apt 1802, South City Luxury Enclave',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700068',
        country: 'India',
        phone: '+91 98305 11223',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-ananya',
    name: 'Dr. Ananya Mukherjee',
    email: 'ananya.mukherjee@aiims.edu',
    phone: '+91 94331 44556',
    memberTier: 'Atelier Connoisseur',
    status: 'verified',
    createdAt: '2024-05-18T09:12:00.000Z',
    lastActiveAt: '2026-09-16T11:20:00.000Z',
    ordersCount: 3,
    totalSpent: 48900,
    savedAddressesCount: 1,
    cartItemsCount: 0,
    wishlistItemsCount: 3,
    notes: 'Purchased 22K Gold Badhano Shankha Pair with BIS Hallmark certification.',
    savedAddresses: [
      {
        fullName: 'Dr. Ananya Mukherjee',
        addressLine1: 'Block CD, Sector 1, Salt Lake City',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700064',
        country: 'India',
        phone: '+91 94331 44556',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-deblina',
    name: 'Deblina Banerjee',
    email: 'deblina.b@tcs.com',
    phone: '+91 98200 99881',
    memberTier: 'Atelier Connoisseur',
    status: 'active',
    createdAt: '2024-08-22T16:05:00.000Z',
    lastActiveAt: '2026-09-15T19:10:00.000Z',
    ordersCount: 2,
    totalSpent: 29500,
    savedAddressesCount: 1,
    cartItemsCount: 1,
    wishlistItemsCount: 2,
    notes: 'Interstate customer. Express air courier tracking requested.',
    savedAddresses: [
      {
        fullName: 'Deblina Banerjee',
        addressLine1: 'Flat 402, Hiranandani Estate, Thane West',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400607',
        country: 'India',
        phone: '+91 98200 99881',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-priyanka',
    name: 'Priyanka Roy Chowdhury',
    email: 'priyanka.rc@outlook.com',
    phone: '+91 97488 33221',
    memberTier: 'NaxtTo Circle',
    status: 'active',
    createdAt: '2024-11-05T08:45:00.000Z',
    lastActiveAt: '2026-09-17T21:15:00.000Z',
    ordersCount: 1,
    totalSpent: 14500,
    savedAddressesCount: 1,
    cartItemsCount: 0,
    wishlistItemsCount: 6,
    notes: 'Subscribed to monthly Kolkata Bullion rate newsletter.',
    savedAddresses: [
      {
        fullName: 'Priyanka Roy Chowdhury',
        addressLine1: '12/1 Ritchie Road, Ballygunge',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700019',
        country: 'India',
        phone: '+91 97488 33221',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-sourav',
    name: 'Sourav Ganguly',
    email: 'sourav.g@cricketbengal.org',
    phone: '+91 98300 00001',
    memberTier: 'VIP Privé',
    status: 'vip',
    createdAt: '2023-11-12T12:00:00.000Z',
    lastActiveAt: '2026-09-14T10:30:00.000Z',
    ordersCount: 6,
    totalSpent: 185000,
    savedAddressesCount: 2,
    cartItemsCount: 3,
    wishlistItemsCount: 8,
    notes: 'VIP White Glove patron. Requires direct studio dispatch.',
    savedAddresses: [
      {
        fullName: 'Sourav Ganguly',
        addressLine1: 'Biren Roy Road West, Behala',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700008',
        country: 'India',
        phone: '+91 98300 00001',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-moumita',
    name: 'Moumita Sen',
    email: 'moumita.sen@yahoo.in',
    phone: '+91 90512 88441',
    memberTier: 'NaxtTo Circle',
    status: 'active',
    createdAt: '2025-01-20T17:22:00.000Z',
    lastActiveAt: '2026-09-12T15:40:00.000Z',
    ordersCount: 1,
    totalSpent: 8999,
    savedAddressesCount: 1,
    cartItemsCount: 0,
    wishlistItemsCount: 1,
    notes: 'Custom Coral Pola pair for annaprashan gifting.',
    savedAddresses: [
      {
        fullName: 'Moumita Sen',
        addressLine1: '4th Block, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560034',
        country: 'India',
        phone: '+91 90512 88441',
        isDefault: true
      }
    ]
  }
];

let platformSellersStore = [
  {
    id: 'seller-bowbazar',
    storeName: 'Bowbazar Master Goldsmiths Guild',
    ownerName: 'Rabindranath Karmakar',
    email: 'seller@naxtto.com',
    phone: '+91 98301 24590',
    status: 'verified',
    badge: 'Master Artisan Guild',
    city: 'Bowbazar, Kolkata',
    rating: 4.95,
    totalProducts: 14,
    totalOrdersFulfilled: 128,
    totalRevenue: 486200,
    commissionRate: 8.0,
    gstNumber: '19AABCU9603R1ZM',
    joinedDate: '2024-03-15',
    workshopAddress: '142 Bipin Behari Ganguly St, Bowbazar, Kolkata 700012',
    bankAccountLast4: '4491'
  },
  {
    id: 'seller-barasat',
    storeName: 'Barasat Conch Shell Artisan Guild',
    ownerName: 'Dipankar Shankhari',
    email: 'artisan@naxtto.com',
    phone: '+91 97321 88402',
    status: 'verified',
    badge: 'Heritage Workshop',
    city: 'Barasat, 24 Parganas (N)',
    rating: 4.90,
    totalProducts: 8,
    totalOrdersFulfilled: 94,
    totalRevenue: 268400,
    commissionRate: 7.5,
    gstNumber: '19BKDPS4412K1Z9',
    joinedDate: '2024-05-20',
    workshopAddress: 'Shankhaban Lane, Post Office Rd, Barasat, WB 700124',
    bankAccountLast4: '8820'
  },
  {
    id: 'seller-murshidabad',
    storeName: 'Murshidabad Coral & Pola Atelier',
    ownerName: 'Subhashis Roy',
    email: 'curator@naxtto.com',
    phone: '+91 94340 19283',
    status: 'verified',
    badge: 'Certified Seller',
    city: 'Berhampore, Murshidabad',
    rating: 4.85,
    totalProducts: 6,
    totalOrdersFulfilled: 62,
    totalRevenue: 154800,
    commissionRate: 8.5,
    gstNumber: '19ACXPR1098L1ZT',
    joinedDate: '2024-08-11',
    workshopAddress: 'Station Road, Berhampore, Murshidabad 742101',
    bankAccountLast4: '1093'
  },
  {
    id: 'seller-naxtto-flagship',
    storeName: 'NaxtTo Signature Haute Joaillerie',
    ownerName: 'Anik Baidya',
    email: 'anik@naxtto.com',
    phone: '+91 98310 99999',
    status: 'verified',
    badge: 'Master Artisan Guild',
    city: 'Park Street, Kolkata',
    rating: 5.0,
    totalProducts: 18,
    totalOrdersFulfilled: 215,
    totalRevenue: 1240000,
    commissionRate: 0.0,
    gstNumber: '19NAXTTO2026A1Z5',
    joinedDate: '2023-01-01',
    workshopAddress: 'Camac Street Commercial Center, Kolkata 700016',
    bankAccountLast4: '9901'
  },
  {
    id: 'seller-howrah-loha',
    storeName: 'Bengal Loha Badhano Karigar Union',
    ownerName: 'Pranab Mondal',
    email: 'supplier@naxtto.com',
    phone: '+91 98765 43210',
    status: 'active',
    badge: 'Direct Artisan',
    city: 'Howrah & Midnapore',
    rating: 4.88,
    totalProducts: 5,
    totalOrdersFulfilled: 47,
    totalRevenue: 198000,
    commissionRate: 8.0,
    gstNumber: '19BPLMK5521H1ZQ',
    joinedDate: '2024-10-04',
    workshopAddress: 'Salkia School Road, Howrah 711106',
    bankAccountLast4: '3318'
  }
];

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

