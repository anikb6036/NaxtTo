import React, { useState } from 'react';
import { 
  ArrowLeft,
  User, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut, 
  Check, 
  ShieldCheck, 
  Truck, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  CreditCard,
  Lock,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Eye,
  EyeOff,
  Sparkles,
  LogIn,
  Sliders
} from 'lucide-react';
import { UserProfile, Order, Address, Product } from '../types';
import { BrandLogo } from './BrandLogo';

interface AccountPageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onBackToShop: () => void;
  onOpenWishlist: () => void;
  onSelectProduct?: (product: Product) => void;
  onNavigateToAdmin?: () => void;
  currencySymbol: string;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  user,
  onUpdateUser,
  onBackToShop,
  onOpenWishlist,
  onNavigateToAdmin,
  currencySymbol
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'preferences' | 'security'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userPhone, setUserPhone] = useState(user.phone || '+44 20 7946 0912');
  const [preferredRingSize, setPreferredRingSize] = useState(user.preferences.ringSize || 'US 6');
  const [preferredMetal, setPreferredMetal] = useState(user.preferences.metalPreference || '18k-yellow-gold');
  const [newsletterSub, setNewsletterSub] = useState(user.preferences.newsletterSubscribed);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Unauthenticated Login / Register state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('sophia.montgomery@atelier.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRingSize, setRegRingSize] = useState('US 6');

  // Address management state
  const [addresses, setAddresses] = useState<Address[]>(user.savedAddresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newAddrRecipient, setNewAddrRecipient] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrZip, setNewAddrZip] = useState('');
  const [newAddrCountry, setNewAddrCountry] = useState('United Kingdom');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  // Password / Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const identifier = loginEmail.trim().toLowerCase();

    if (!identifier) {
      setAuthError('Please enter your email address or Admin ID.');
      return;
    }

    setAuthLoading(true);

    // Check if entered credentials match Admin credentials
    const adminIdentifiers = ['admin', 'admin@naxtto.com', 'admin@atelier.com', 'admin@gmail.com', 'director', 'manager', 'atelier', 'adminuser', 'administrator'];
    const isAdminUser = adminIdentifiers.includes(identifier) || identifier.startsWith('admin');

    setTimeout(() => {
      setAuthLoading(false);

      if (isAdminUser) {
        // Authenticate Admin and navigate to Admin Panel
        if (rememberMe) {
          localStorage.setItem('naxtto_admin_auth', 'true');
        } else {
          sessionStorage.setItem('naxtto_admin_auth', 'true');
        }
        if (onNavigateToAdmin) {
          onNavigateToAdmin();
        }
      } else {
        // Authenticate Customer / Patron and stay on User Panel
        onUpdateUser({
          isLoggedIn: true,
          email: loginEmail,
          name: loginEmail.toLowerCase().includes('sophia') ? 'Sophia Montgomery' : (userName || 'Valued Patron')
        });
      }
    }, 300);
  };

  const handleDemoLogin = () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      onUpdateUser({
        id: 'user-001',
        name: 'Sophia Montgomery',
        email: 'sophia.montgomery@atelier.com',
        isLoggedIn: true,
        memberTier: 'Atelier Connoisseur'
      });
      setUserName('Sophia Montgomery');
      setUserEmail('sophia.montgomery@atelier.com');
    }, 250);
  };

  const handleAdminDemoLogin = () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      if (rememberMe) {
        localStorage.setItem('naxtto_admin_auth', 'true');
      } else {
        sessionStorage.setItem('naxtto_admin_auth', 'true');
      }
      if (onNavigateToAdmin) {
        onNavigateToAdmin();
      }
    }, 250);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!regName || !regEmail || !regPassword) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      onUpdateUser({
        id: `user-${Date.now()}`,
        name: regName,
        email: regEmail,
        isLoggedIn: true,
        memberTier: 'NaxtTo Circle',
        memberSince: 'August 2026',
        preferences: {
          ...user.preferences,
          ringSize: regRingSize,
          newsletterSubscribed: true
        }
      });
      setUserName(regName);
      setUserEmail(regEmail);
    }, 300);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: userName,
      email: userEmail,
      phone: userPhone,
      preferences: {
        ...user.preferences,
        ringSize: preferredRingSize,
        newsletterSubscribed: newsletterSub
      }
    });
    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSignOut = () => {
    onUpdateUser({ isLoggedIn: false });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrCity) return;

    let updatedAddresses: Address[];
    if (editingAddressId) {
      updatedAddresses = addresses.map(a => a.id === editingAddressId ? {
        ...a,
        fullName: newAddrRecipient || user.name,
        addressLine1: newAddrStreet,
        city: newAddrCity,
        state: newAddrState,
        postalCode: newAddrZip,
        country: newAddrCountry,
        phone: userPhone || '+1 555 019 2831',
        isDefault: newAddrIsDefault
      } : (newAddrIsDefault ? { ...a, isDefault: false } : a));
    } else {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        fullName: newAddrRecipient || user.name,
        addressLine1: newAddrStreet,
        city: newAddrCity,
        state: newAddrState,
        postalCode: newAddrZip,
        country: newAddrCountry,
        phone: userPhone || '+1 555 019 2831',
        isDefault: newAddrIsDefault || addresses.length === 0
      };
      updatedAddresses = newAddrIsDefault 
        ? addresses.map(a => ({ ...a, isDefault: false })).concat(newAddress)
        : [...addresses, newAddress];
    }

    setAddresses(updatedAddresses);
    onUpdateUser({ savedAddresses: updatedAddresses });
    setShowAddressForm(false);
    setEditingAddressId(null);
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrZip('');
    setNewAddrRecipient('');
  };

  const handleDeleteAddress = (id?: string) => {
    if (!id) return;
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    onUpdateUser({ savedAddresses: updated });
  };

  const handleSetDefaultAddress = (id?: string) => {
    if (!id) return;
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    onUpdateUser({ savedAddresses: updated });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return;
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  // IF NOT LOGGED IN -> RENDER LOGIN & REGISTRATION SCREEN
  if (!user.isLoggedIn) {
    return (
      <div id="login-page" className="w-full bg-[#fbfbfa] text-[#1d1d1f] min-h-screen font-sans">
        {/* Top Header / Breadcrumbs */}
        <div className="border-b border-[#e5e5ea] bg-white sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#6e6e73]">
              <button
                onClick={onBackToShop}
                className="flex items-center gap-1.5 text-[#1d1d1f] hover:text-[#0071e3] font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Collection</span>
              </button>
              <span className="text-[#d2d2d7]">/</span>
              <span className="text-[#1d1d1f] font-medium">Login</span>
            </div>

            <button
              onClick={onBackToShop}
              className="text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Login & Register Container */}
        <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="bg-white rounded-3xl border border-[#e5e5ea] p-6 sm:p-8 shadow-xs space-y-7">
            
            {/* Header / Brand Title */}
            <div className="text-center space-y-3">
              <BrandLogo 
                layout="vertical" 
                size="lg" 
                variant="dark" 
                showSubtitle={true} 
                subtitleText="Fine Jewellery Atelier"
                className="mx-auto" 
              />
              <h2 className="font-serif text-xl sm:text-2xl font-light text-[#1d1d1f] pt-1">
                {authMode === 'login' ? 'Sign In to Your Account' : 'Create Atelier Account'}
              </h2>
              <p className="text-xs text-[#6e6e73] max-w-sm mx-auto leading-relaxed">
                {authMode === 'login' 
                  ? 'Access your bespoke curations, saved ring sizing, insured orders, and member privileges.'
                  : 'Join the NaxtTo Circle for personalized sizing, bespoke concierge, and preview access.'}
              </p>
            </div>

            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="flex items-center p-1 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
              <button
                type="button"
                id="tab-btn-signin"
                onClick={() => { setAuthMode('login'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-[#1d1d1f] shadow-2xs font-semibold'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                id="tab-btn-register"
                onClick={() => { setAuthMode('register'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-white text-[#1d1d1f] shadow-2xs font-semibold'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <span>{authError}</span>
              </div>
            )}

            {/* Sign In Form */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Email Address or Admin ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="e.g. sophia.montgomery@atelier.com or admin"
                      className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                    />
                    <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-[#1d1d1f]">
                      Password / Passkey
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset instructions have been dispatched to your email address.')}
                      className="text-[11px] text-[#0071e3] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="Enter password (e.g. admin123)"
                      className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                    />
                    <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-2.5 text-[#86868b] hover:text-[#1d1d1f]"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6e6e73]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-[#d2d2d7] text-[#1d1d1f] focus:ring-0"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="submit-signin-btn"
                  disabled={authLoading}
                  className="w-full bg-[#1d1d1f] hover:bg-black text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>

                {/* 1-Click Demo Logins for Patron & Admin */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    id="demo-login-patron-btn"
                    onClick={handleDemoLogin}
                    disabled={authLoading}
                    className="w-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>1-Click Demo Sign-In (Sophia Montgomery - Patron)</span>
                  </button>

                  <button
                    type="button"
                    id="demo-login-admin-btn"
                    onClick={handleAdminDemoLogin}
                    disabled={authLoading}
                    className="w-full bg-[#2c2c2e] hover:bg-black border border-[#3a3a3c] text-white py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-300" />
                    <span>1-Click Demo Sign-In (Atelier Administrator)</span>
                  </button>
                </div>

                {/* Quick Hint Card */}
                <div className="p-3 bg-[#f8f8fa] border border-[#e5e5ea] rounded-xl text-[11px] text-[#6e6e73] space-y-1 mt-3">
                  <div className="flex items-center gap-1.5 font-medium text-[#1d1d1f]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Unified Authentication:</span>
                  </div>
                  <div className="flex justify-between items-center text-[10.5px] text-[#6e6e73]">
                    <span>• User: <code>sophia.montgomery@atelier.com</code></span>
                    <span className="font-medium text-[#1d1d1f]">User Account</span>
                  </div>
                  <div className="flex justify-between items-center text-[10.5px] text-[#6e6e73]">
                    <span>• Admin: <code>admin</code> (password: <code>admin123</code>)</span>
                    <span className="font-medium text-[#1d1d1f]">Admin Panel</span>
                  </div>
                </div>
              </form>
            )}

            {/* Register Form */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="e.g. Victoria Sterling"
                      className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                    />
                    <User className="w-4 h-4 text-[#86868b] absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="victoria@example.com"
                      className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                    />
                    <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="At least 8 chars"
                      className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Standard Ring Size Preference
                  </label>
                  <select
                    value={regRingSize}
                    onChange={e => setRegRingSize(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                  >
                    {['US 5', 'US 5.5', 'US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5'].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-1">
                  <p className="text-[11px] text-[#86868b] leading-relaxed">
                    By joining the NaxtTo Circle, you agree to the Atelier Privé Terms and receive discrete updates on new collections and diamond crystallizations.
                  </p>
                </div>

                <button
                  type="submit"
                  id="submit-register-btn"
                  disabled={authLoading}
                  className="w-full bg-[#1d1d1f] hover:bg-black text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Create Atelier Account</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Guarantee */}
            <div className="pt-3 border-t border-[#e5e5ea] flex items-center justify-center gap-3 text-[11px] text-[#86868b]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                256-Bit Encrypted
              </span>
              <span>•</span>
              <span>Zero Spam Guarantee</span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // IF LOGGED IN -> RENDER COMPLETE ACCOUNT DASHBOARD
  return (
    <div id="account-page" className="w-full bg-white text-[#1d1d1f] min-h-screen font-sans">
      {/* Top Header / Breadcrumbs */}
      <div className="border-b border-[#e5e5ea] bg-white sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#6e6e73]">
            <button
              onClick={onBackToShop}
              className="flex items-center gap-1.5 text-[#1d1d1f] hover:text-[#0071e3] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Collection</span>
            </button>
            <span className="text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] font-medium">Account</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="account-header-signout-btn"
              onClick={handleSignOut}
              className="px-3.5 py-1.5 rounded-lg border border-[#e5e5ea] hover:border-[#1d1d1f] text-xs font-semibold text-[#1d1d1f] transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Account Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Navigation Sidebar (3.5 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Profile Card */}
            <div className="p-6 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#1d1d1f]/10"
                />
                <div className="overflow-hidden">
                  <h2 className="text-base font-semibold text-[#1d1d1f] truncate">{user.name}</h2>
                  <p className="text-xs text-[#6e6e73] truncate">{user.email}</p>
                  <span className="inline-block text-[11px] bg-white border border-[#e5e5ea] text-[#1d1d1f] px-2.5 py-0.5 rounded-full font-medium mt-1.5 shadow-2xs">
                    {user.memberTier}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e5e5ea] flex items-center justify-between text-xs text-[#6e6e73]">
                <span>Patron since {user.memberSince}</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-2 rounded-2xl bg-white border border-[#e5e5ea] space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                  activeTab === 'profile' 
                    ? 'bg-[#1d1d1f] text-white font-semibold shadow-xs' 
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Profile & Patron Privileges</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                  activeTab === 'orders' 
                    ? 'bg-[#1d1d1f] text-white font-semibold shadow-xs' 
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Order History ({user.orderHistory?.length || 0})</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                  activeTab === 'addresses' 
                    ? 'bg-[#1d1d1f] text-white font-semibold shadow-xs' 
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses ({addresses.length})</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                  activeTab === 'preferences' 
                    ? 'bg-[#1d1d1f] text-white font-semibold shadow-xs' 
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Personal Details & Preferences</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                  activeTab === 'security' 
                    ? 'bg-[#1d1d1f] text-white font-semibold shadow-xs' 
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4" />
                  <span>Security & Privacy</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={onOpenWishlist}
                className="w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <span>Curated Wishlist</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </button>

              {onNavigateToAdmin && (
                <div className="pt-2 border-t border-[#e5e5ea]">
                  <button
                    id="account-sidebar-admin-btn"
                    onClick={onNavigateToAdmin}
                    className="w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders className="w-3.5 h-3.5 opacity-70" />
                      <span>Atelier Staff Portal</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-[#e5e5ea]">
                <button
                  id="account-sidebar-signout-btn"
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </nav>

            {/* Concierge Assistance Card */}
            <div className="p-5 rounded-2xl bg-white border border-[#e5e5ea] space-y-2">
              <h4 className="text-xs font-semibold text-[#1d1d1f]">Private Concierge</h4>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                Dedicated personal advice on sizing, gemstone selection, and custom metallurgical commissions.
              </p>
              <p className="text-xs font-medium text-[#0071e3] pt-1">concierge@naxtto.com</p>
            </div>
          </div>

          {/* Right Main Content Panel (8.5 cols) */}
          <div className="lg:col-span-8">
            
            {/* TAB 1: Profile & Patron Privileges */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                      Patron Status & Atelier Privileges
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                      Overview of your verified client tier and bespoke services
                    </p>
                  </div>
                </div>

                {/* Tier Banner */}
                <div className="p-6 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-[#86868b]">
                      Membership Tier
                    </span>
                    <h3 className="text-2xl font-semibold text-[#1d1d1f]">{user.memberTier}</h3>
                    <p className="text-xs text-[#6e6e73]">
                      Member since {user.memberSince} • Lifetime polish and inspection guarantee
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#e5e5ea] shadow-2xs self-start sm:self-auto">
                    <ShieldCheck className="w-8 h-8 text-[#c5a059]" />
                  </div>
                </div>

                {/* Privileges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-[#e5e5ea] bg-white space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                      <Truck className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#1d1d1f]">Insured Courier Included</h4>
                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      Complimentary express tracked delivery on every single piece worldwide with armored courier.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-[#e5e5ea] bg-white space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#1d1d1f]">Annual Ultrasonic Spa</h4>
                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      Complimentary professional ultrasonic cleaning, prong tightening, and polish restoration every year.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-[#e5e5ea] bg-white space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#1d1d1f]">Early Salon Access</h4>
                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      Exclusive 48-hour preview window for limited metallurgical releases and seasonal creations.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-[#e5e5ea] bg-white space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#1d1d1f]">Bespoke Commission Priority</h4>
                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      Direct consultation with our Milan master goldsmiths for personalized engraving and custom settings.
                    </p>
                  </div>
                </div>

                {/* Quick Profile Summary */}
                <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#1d1d1f]">Account Overview</h3>
                    <button
                      onClick={() => setActiveTab('preferences')}
                      className="text-xs text-[#0071e3] font-medium hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Details</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
                      <span className="text-[#86868b] block mb-0.5">Full Name</span>
                      <span className="font-semibold text-[#1d1d1f] text-sm">{user.name}</span>
                    </div>

                    <div className="p-3 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
                      <span className="text-[#86868b] block mb-0.5">Email Address</span>
                      <span className="font-semibold text-[#1d1d1f] text-sm">{user.email}</span>
                    </div>

                    <div className="p-3 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
                      <span className="text-[#86868b] block mb-0.5">Preferred Ring Size</span>
                      <span className="font-semibold text-[#1d1d1f] text-sm">{user.preferences.ringSize || 'US 6'}</span>
                    </div>

                    <div className="p-3 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
                      <span className="text-[#86868b] block mb-0.5">Preferred Precious Metal</span>
                      <span className="font-semibold text-[#1d1d1f] text-sm capitalize">
                        {user.preferences.metalPreference?.replace(/-/g, ' ') || '18K Yellow Gold'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Order History */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                      Order History
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                      Review previous purchases, track shipments, and access invoices
                    </p>
                  </div>
                </div>

                {user.orderHistory && user.orderHistory.length > 0 ? (
                  <div className="space-y-5">
                    {user.orderHistory.map((order) => (
                      <div 
                        key={order.id}
                        className="p-6 rounded-2xl border border-[#e5e5ea] bg-white space-y-4 shadow-2xs hover:shadow-sm transition-all"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e5e5ea] text-xs">
                          <div>
                            <span className="text-[#86868b]">Order Number: </span>
                            <span className="font-semibold text-[#1d1d1f]">{order.orderNumber}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[#86868b]">Placed: {order.date}</span>
                            <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : order.status === 'Dispatched'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-16 h-16 rounded-xl object-cover bg-[#f5f5f7] border border-[#e5e5ea] shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-[#1d1d1f] truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-xs text-[#6e6e73]">
                                  Size: {item.selectedSize || 'Standard'} • {item.selectedFinish?.replace(/-/g, ' ') || 'Solid Gold'} • Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-sm font-semibold text-[#1d1d1f] text-right shrink-0">
                                {currencySymbol}{item.product.price * item.quantity}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Tracking */}
                        <div className="pt-4 border-t border-[#e5e5ea] flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div>
                            {order.trackingNumber && (
                              <span className="text-[#6e6e73]">
                                Tracking: <strong className="text-[#1d1d1f] font-mono">{order.trackingNumber}</strong>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-xs text-[#6e6e73]">Total:</span>
                            <span className="text-base font-semibold text-[#1d1d1f]">
                              {currencySymbol}{order.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-[#f5f5f7] rounded-2xl border border-[#e5e5ea] space-y-3">
                    <ShoppingBag className="w-8 h-8 text-[#86868b] mx-auto" />
                    <h3 className="text-base font-semibold text-[#1d1d1f]">No Orders Yet</h3>
                    <p className="text-xs text-[#6e6e73] max-w-sm mx-auto">
                      Explore our handcrafted creations in solid 18k gold to begin your collection.
                    </p>
                    <button
                      onClick={onBackToShop}
                      className="mt-2 px-5 py-2.5 bg-[#1d1d1f] text-white text-xs font-semibold rounded-xl hover:bg-black transition-all"
                    >
                      Explore Creations
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                      Saved Addresses
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                      Manage delivery destinations for seamless insured courier dispatch
                    </p>
                  </div>

                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setEditingAddressId(null);
                        setNewAddrRecipient(user.name);
                        setNewAddrStreet('');
                        setNewAddrCity('');
                        setNewAddrState('');
                        setNewAddrZip('');
                        setNewAddrCountry('United Kingdom');
                        setNewAddrIsDefault(addresses.length === 0);
                        setShowAddressForm(true);
                      }}
                      className="px-4 py-2 bg-[#1d1d1f] text-white text-xs font-semibold rounded-xl hover:bg-black transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Address</span>
                    </button>
                  )}
                </div>

                {/* Add / Edit Address Form Modal/Inline */}
                {showAddressForm && (
                  <form onSubmit={handleSaveAddress} className="p-6 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] space-y-4 animate-scaleIn">
                    <h3 className="text-sm font-semibold text-[#1d1d1f]">
                      {editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={newAddrRecipient}
                          onChange={e => setNewAddrRecipient(e.target.value)}
                          placeholder="e.g. Sophia Montgomery"
                          className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newAddrStreet}
                          onChange={e => setNewAddrStreet(e.target.value)}
                          placeholder="e.g. 742 Evergreen Gardens, Apt 4B"
                          className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddrCity}
                          onChange={e => setNewAddrCity(e.target.value)}
                          placeholder="e.g. London"
                          className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">State / Province / Region</label>
                        <input
                          type="text"
                          value={newAddrState}
                          onChange={e => setNewAddrState(e.target.value)}
                          placeholder="e.g. Greater London"
                          className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Postal / ZIP Code</label>
                        <input
                          type="text"
                          required
                          value={newAddrZip}
                          onChange={e => setNewAddrZip(e.target.value)}
                          placeholder="e.g. W1K 7TH"
                          className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Country</label>
                        <input
                          type="text"
                          required
                          value={newAddrCountry}
                          onChange={e => setNewAddrCountry(e.target.value)}
                          placeholder="e.g. United Kingdom"
                          className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="addr-default-check"
                        checked={newAddrIsDefault}
                        onChange={e => setNewAddrIsDefault(e.target.checked)}
                        className="w-4 h-4 rounded text-[#1d1d1f] accent-[#1d1d1f]"
                      />
                      <label htmlFor="addr-default-check" className="text-xs text-[#1d1d1f]">
                        Set as default shipping address
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#1d1d1f] text-white text-xs font-semibold rounded-xl hover:bg-black transition-all"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2.5 border border-[#e5e5ea] text-xs font-medium rounded-xl hover:bg-white transition-all text-[#6e6e73]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr, idx) => (
                    <div 
                      key={addr.id || idx}
                      className={`p-5 rounded-2xl border bg-white space-y-3 relative transition-all ${
                        addr.isDefault 
                          ? 'border-[#1d1d1f] ring-1 ring-[#1d1d1f]/10 shadow-xs' 
                          : 'border-[#e5e5ea]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#1d1d1f]" />
                          <h4 className="text-sm font-semibold text-[#1d1d1f]">{addr.fullName}</h4>
                        </div>
                        {addr.isDefault && (
                          <span className="text-[10px] uppercase tracking-wider bg-[#1d1d1f]/5 text-[#1d1d1f] font-semibold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#48484a] leading-relaxed">
                        {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                        {addr.city}, {addr.state} {addr.postalCode}<br />
                        {addr.country}
                      </p>

                      <div className="pt-2 border-t border-[#e5e5ea] flex items-center justify-between text-xs text-[#6e6e73]">
                        {!addr.isDefault ? (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[#0071e3] hover:underline text-xs"
                          >
                            Set Default
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium">Primary Destination</span>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAddressId(addr.id || `addr-${idx}`);
                              setNewAddrRecipient(addr.fullName);
                              setNewAddrStreet(addr.addressLine1);
                              setNewAddrCity(addr.city);
                              setNewAddrState(addr.state);
                              setNewAddrZip(addr.postalCode);
                              setNewAddrCountry(addr.country);
                              setNewAddrIsDefault(Boolean(addr.isDefault));
                              setShowAddressForm(true);
                            }}
                            className="p-1.5 hover:bg-[#f5f5f7] rounded-lg text-[#1d1d1f] transition-colors"
                            title="Edit address"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Personal Details & Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                      Personal Details & Preferences
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                      Customize sizing defaults and client newsletter preferences
                    </p>
                  </div>

                  {saveSuccess && (
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium flex items-center gap-1 border border-emerald-200">
                      <Check className="w-3.5 h-3.5" /> Saved Successfully
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-white space-y-4">
                    <h3 className="text-sm font-semibold text-[#1d1d1f]">Contact Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={e => setUserName(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={userEmail}
                          onChange={e => setUserEmail(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Phone (for Courier Delivery)</label>
                        <input
                          type="tel"
                          value={userPhone}
                          onChange={e => setUserPhone(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-white space-y-4">
                    <h3 className="text-sm font-semibold text-[#1d1d1f]">Jewellery Defaults</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Default Ring Size</label>
                        <select
                          value={preferredRingSize}
                          onChange={e => setPreferredRingSize(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        >
                          <option value="US 5">US 5 (15.7mm)</option>
                          <option value="US 6">US 6 (16.5mm)</option>
                          <option value="US 7">US 7 (17.3mm)</option>
                          <option value="US 8">US 8 (18.1mm)</option>
                          <option value="US 9">US 9 (18.9mm)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Preferred Metal Finish</label>
                        <select
                          value={preferredMetal}
                          onChange={e => setPreferredMetal(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        >
                          <option value="18k-yellow-gold">18K Solid Yellow Gold</option>
                          <option value="18k-white-gold">18K Solid White Gold</option>
                          <option value="18k-rose-gold">18K Solid Rose Gold</option>
                          <option value="platinum-950">Platinum 950</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 text-xs text-[#1d1d1f] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newsletterSub}
                          onChange={e => setNewsletterSub(e.target.checked)}
                          className="w-4 h-4 rounded text-[#1d1d1f] accent-[#1d1d1f]"
                        />
                        <span>Receive weekly private salon announcements and metallurgical releases</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all"
                  >
                    Save Preferences
                  </button>
                </form>
              </div>
            )}

            {/* TAB 5: Security & Privacy */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                      Security & Privacy
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                      Manage password credentials and account security
                    </p>
                  </div>

                  {passwordSuccess && (
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium flex items-center gap-1 border border-emerald-200">
                      <Check className="w-3.5 h-3.5" /> Password Updated
                    </span>
                  )}
                </div>

                <form onSubmit={handlePasswordSubmit} className="p-6 rounded-2xl border border-[#e5e5ea] bg-white space-y-4">
                  <h3 className="text-sm font-semibold text-[#1d1d1f]">Change Password</h3>

                  <div className="space-y-3 max-w-md text-xs">
                    <div>
                      <label className="block text-[#1d1d1f] font-medium mb-1">Current Password</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1d1d1f] font-medium mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1d1d1f] font-medium mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 px-5 py-2.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-white space-y-3">
                  <h3 className="text-sm font-semibold text-[#1d1d1f]">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">
                    Protect your high-value fine jewellery orders and saved addresses with hardware security or authenticator apps.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> 2FA Enabled via SMS/Email Verification
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
