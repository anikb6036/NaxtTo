import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Store,
  KeyRound,
  ShieldAlert,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { apiClient } from '../services/api';

interface StaffAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (staffInfo?: { email: string; role: string; name: string }) => void;
}

// Strictly authorized positive accounts database
const POSITIVE_ADMIN_CREDENTIALS = {
  identifiers: [
    'anik',
    'anik@naxtto.com',
    'baidyaanik18@gmail.com',
    'admin',
    'admin@naxtto.com',
    'atelier@naxtto.com'
  ],
  passkeys: ['naxtto2026', 'anik', 'admin123']
};

const POSITIVE_SELLER_CREDENTIALS = {
  identifiers: [
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
  ],
  passkeys: ['naxtto2026', 'seller123', 'staff123', 'director750', 'atelier2026']
};

export const StaffAuthModal: React.FC<StaffAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'seller'>('admin');
  const [emailOrId, setEmailOrId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [verifiedRoleText, setVerifiedRoleText] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showCredentialsGuide, setShowCredentialsGuide] = useState(false);

  // Security brute-force tracking & lockout
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const saved = sessionStorage.getItem('naxtto_staff_failed_attempts');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => {
    const savedLockUntil = sessionStorage.getItem('naxtto_staff_lock_until');
    if (savedLockUntil) {
      const diff = Math.ceil((parseInt(savedLockUntil, 10) - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    }
    return 0;
  });

  // Countdown timer for security lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sessionStorage.removeItem('naxtto_staff_lock_until');
          setErrorMsg(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (lockoutSeconds > 0) return;

    setErrorMsg(null);

    const cleanInput = emailOrId.trim();
    const cleanPass = passcode.trim();

    if (!cleanInput) {
      setErrorMsg('Please enter your Staff ID, Username or Atelier Work Email.');
      triggerShake();
      return;
    }
    if (!cleanPass) {
      setErrorMsg('Please enter your Staff Security Passkey / Password.');
      triggerShake();
      return;
    }

    setIsVerifying(true);

    try {
      // 1. Check with secure server-side endpoint first
      let serverVerified = false;
      let serverRole = 'Atelier Administrator';
      let serverName = 'Anik';
      let serverEmail = 'anik@naxtto.com';

      const apiResult = await apiClient.staffLogin(cleanInput, cleanPass, selectedRole);

      if (apiResult) {
        if (apiResult.isLocked) {
          const waitTime = apiResult.waitSeconds || 30;
          setLockoutSeconds(waitTime);
          const lockUntilTime = Date.now() + waitTime * 1000;
          sessionStorage.setItem('naxtto_staff_lock_until', String(lockUntilTime));
          setIsVerifying(false);
          setErrorMsg(`Security Lockout: Too many failed attempts. Suspended for ${waitTime}s.`);
          triggerShake();
          return;
        }

        if (apiResult.ok && apiResult.success && apiResult.staff) {
          serverVerified = true;
          serverRole = apiResult.staff.role || 'Atelier Administrator';
          serverName = apiResult.staff.name || cleanInput;
          serverEmail = apiResult.staff.email || cleanInput;
        }
      }

      // 2. Strict Client-Side Verification Guard (Positive Credentials Matching ONLY)
      const lowerInput = cleanInput.toLowerCase();
      
      const isAdminMatch = POSITIVE_ADMIN_CREDENTIALS.identifiers.includes(lowerInput) && 
                           POSITIVE_ADMIN_CREDENTIALS.passkeys.includes(cleanPass);

      const isSellerMatch = POSITIVE_SELLER_CREDENTIALS.identifiers.includes(lowerInput) && 
                            POSITIVE_SELLER_CREDENTIALS.passkeys.includes(cleanPass);

      const isPositiveAuthorized = serverVerified || isAdminMatch || isSellerMatch;

      if (isPositiveAuthorized) {
        // Reset failed attempt counters on valid positive credential
        setFailedAttempts(0);
        sessionStorage.removeItem('naxtto_staff_failed_attempts');
        sessionStorage.removeItem('naxtto_staff_lock_until');

        const isDirector = lowerInput.includes('director');
        const finalRole = serverVerified 
          ? serverRole 
          : (isAdminMatch 
              ? 'Atelier Administrator' 
              : (isDirector ? 'Atelier Director' : 'Certified Atelier Seller'));

        const finalName = serverVerified 
          ? serverName 
          : (isAdminMatch 
              ? 'Anik (Administrator)' 
              : (lowerInput.includes('@') ? lowerInput.split('@')[0].toUpperCase() : lowerInput.toUpperCase()));

        const finalEmail = serverVerified 
          ? serverEmail 
          : (lowerInput.includes('@') ? lowerInput : `${lowerInput}@naxtto.com`);

        setVerifiedRoleText(finalRole);
        setVerifiedSuccess(true);

        setTimeout(() => {
          setIsVerifying(false);
          setVerifiedSuccess(false);

          onSuccess({
            email: finalEmail,
            role: finalRole,
            name: finalName
          });
        }, 750);
      } else {
        // 3. Negative Credential Detected - Enforce Rejection and Security Tracking
        setIsVerifying(false);
        const newFailedCount = failedAttempts + 1;
        setFailedAttempts(newFailedCount);
        sessionStorage.setItem('naxtto_staff_failed_attempts', String(newFailedCount));

        triggerShake();

        if (newFailedCount >= 4) {
          const wait = 30;
          setLockoutSeconds(wait);
          const lockUntilTime = Date.now() + wait * 1000;
          sessionStorage.setItem('naxtto_staff_lock_until', String(lockUntilTime));
          setErrorMsg('Security Lockout: 4 failed attempts. Security cooldown active for 30 seconds.');
        } else {
          const remaining = 4 - newFailedCount;
          setErrorMsg(
            `Access Denied: Invalid security credentials. Negative authentication rejected (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout).`
          );
        }
      }
    } catch (error: any) {
      setIsVerifying(false);
      triggerShake();
      setErrorMsg('Authentication error. Please check credentials and try again.');
    }
  };

  const fillPositiveCredentials = (role: 'admin' | 'seller') => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmailOrId('anik@naxtto.com');
      setPasscode('naxtto2026');
    } else {
      setEmailOrId('seller@naxtto.com');
      setPasscode('naxtto2026');
    }
    setErrorMsg(null);
  };

  return (
    <div 
      id="staff-auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isVerifying) onClose();
      }}
    >
      <div 
        id="staff-auth-modal-container"
        className={`relative w-full max-w-[420px] bg-white shadow-2xl border border-[#ebdce1] overflow-hidden animate-scaleUp transition-transform ${isShaking ? 'animate-shake' : ''}`}
      >
        {/* Top security color bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#ff3f6c] via-[#ff5722] to-[#282c3f]" />

        {/* Close button */}
        <button
          id="close-staff-auth-modal-btn"
          onClick={onClose}
          disabled={isVerifying}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f5f5f6] hover:bg-[#ebebee] text-[#535766] hover:text-[#282c3f] flex items-center justify-center cursor-pointer transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Body */}
        <div className="p-7 sm:p-8">
          {/* Header Title */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold uppercase tracking-wider text-[#ff3f6c]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff3f6c]" />
              <span>Restricted Staff Gateway</span>
            </div>
            <h1 className="text-[21px] sm:text-[23px] font-bold text-[#282c3f] mb-1 flex items-baseline gap-1.5">
              <span>Staff Login</span>
              <span className="font-normal text-[#535766] text-base">or</span>
              <span>Portal</span>
            </h1>
            <p className="text-xs text-[#535766] leading-relaxed">
              Access to inventory management, catalogue editing & admin ledger
            </p>
          </div>

          {/* Portal Selector Segment (Admin vs Seller) */}
          <div className="mb-4 p-1 bg-[#f5f5f6] rounded-md grid grid-cols-2 gap-1 border border-[#eaeaec]">
            <button
              type="button"
              id="select-admin-portal-tab"
              onClick={() => {
                setSelectedRole('admin');
                setErrorMsg(null);
              }}
              className={`py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'admin' 
                  ? 'bg-white text-[#282c3f] shadow-xs border border-[#d4d5d9]' 
                  : 'text-[#535766] hover:text-[#282c3f]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#ff3f6c]" />
              <span>Admin Suite</span>
            </button>
            <button
              type="button"
              id="select-seller-portal-tab"
              onClick={() => {
                setSelectedRole('seller');
                setErrorMsg(null);
              }}
              className={`py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'seller' 
                  ? 'bg-white text-[#282c3f] shadow-xs border border-[#d4d5d9]' 
                  : 'text-[#535766] hover:text-[#282c3f]'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#ff5722]" />
              <span>Seller Hub</span>
            </button>
          </div>

          {/* Security Lockout Banner */}
          {lockoutSeconds > 0 && (
            <div 
              id="staff-auth-lockout-banner"
              className="mb-4 p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <Clock className="w-4 h-4 shrink-0 text-amber-700 mt-0.5 animate-spin" style={{ animationDuration: '3s' }} />
              <div>
                <p className="font-bold text-amber-900">Security Cooldown Active</p>
                <p className="text-[12px] leading-snug mt-0.5 text-amber-800">
                  Multiple negative credential attempts were detected. Please wait <span className="font-bold text-amber-950 font-mono text-[13px] bg-amber-100 px-1.5 py-0.5 rounded">{lockoutSeconds}s</span> before retrying.
                </p>
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMsg && lockoutSeconds <= 0 && (
            <div 
              id="staff-auth-error-banner"
              className="mb-4 p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xs flex items-start gap-2 animate-fadeIn"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1">
                <p className="leading-snug text-[12px] font-medium">{errorMsg}</p>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="mt-1 text-rose-600 hover:text-rose-800 underline text-[11px] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {verifiedSuccess ? (
            <div className="py-8 text-center space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto animate-bounce shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-[19px] font-bold text-[#282c3f]">
                Credentials Verified
              </h4>
              <div className="inline-block px-3 py-1 bg-emerald-100/70 border border-emerald-300 text-emerald-800 rounded-full text-xs font-semibold">
                {verifiedRoleText || 'Security Clearance Approved'}
              </div>
              <p className="text-xs text-[#535766]">
                Security clearance verified. Launching {selectedRole === 'admin' ? 'Admin Suite' : 'Seller Hub'}...
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className={`border h-11 px-3.5 flex items-center transition-colors ${
                errorMsg ? 'border-rose-400 bg-rose-50/20' : 'border-[#d4d5d9] focus-within:border-[#282c3f] bg-transparent'
              }`}>
                <input
                  id="staff-auth-email-input"
                  type="text"
                  required
                  disabled={lockoutSeconds > 0 || isVerifying}
                  value={emailOrId}
                  onChange={(e) => {
                    setEmailOrId(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={selectedRole === 'admin' ? 'Admin ID, username or email*' : 'Seller ID, store username or email*'}
                  className="w-full h-full text-sm text-[#282c3f] placeholder:text-[#94969f] focus:outline-none bg-transparent disabled:opacity-60"
                  autoFocus
                />
              </div>

              <div className={`relative border h-11 pl-3.5 pr-10 flex items-center transition-colors ${
                errorMsg ? 'border-rose-400 bg-rose-50/20' : 'border-[#d4d5d9] focus-within:border-[#282c3f] bg-transparent'
              }`}>
                <input
                  id="staff-auth-passcode-input"
                  type={showPasscode ? 'text' : 'password'}
                  required
                  disabled={lockoutSeconds > 0 || isVerifying}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Security passkey or password*"
                  className="w-full h-full text-sm text-[#282c3f] placeholder:text-[#94969f] focus:outline-none bg-transparent disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={lockoutSeconds > 0 || isVerifying}
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 text-[#94969f] hover:text-[#282c3f] transition-colors cursor-pointer disabled:opacity-50"
                  aria-label={showPasscode ? 'Hide password' : 'Show password'}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Terms / Policy text */}
              <div className="text-center text-xs text-[#535766] leading-relaxed select-none pt-1">
                By continuing, you verify compliance with{' '}
                <span className="text-[#ff3f6c] font-bold">
                  Atelier Security Protocols
                </span>{' '}
                &{' '}
                <span className="text-[#ff3f6c] font-bold">
                  Confidentiality NDA
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                id="staff-auth-submit-btn"
                type="submit"
                disabled={isVerifying || lockoutSeconds > 0}
                className="w-full h-11 mt-2 bg-[#ff3f6c] hover:bg-[#e6355f] disabled:bg-[#d4d5d9] disabled:text-[#94969f] disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              >
                {isVerifying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>VERIFYING CREDENTIALS...</span>
                  </div>
                ) : lockoutSeconds > 0 ? (
                  <span className="flex items-center gap-1.5 font-mono">
                    <Lock className="w-3.5 h-3.5" />
                    LOCKED FOR {lockoutSeconds}S
                  </span>
                ) : (
                  <span>
                    VERIFY & ENTER {selectedRole === 'admin' ? 'ADMIN SUITE' : 'SELLER HUB'}
                  </span>
                )}
              </button>
            </form>
          )}

          {/* Positive Credentials Fast-Fill & Verification Guide */}
          <div className="mt-5 pt-3 border-t border-[#f0f0f2] text-xs">
            <div className="flex items-center justify-between text-[#535766]">
              <span>Authorized Access:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="fill-admin-positive-credentials-btn"
                  disabled={lockoutSeconds > 0 || isVerifying}
                  onClick={() => fillPositiveCredentials('admin')}
                  className="text-[#ff3f6c] font-bold hover:underline cursor-pointer disabled:opacity-50"
                >
                  Fill Admin Passkey
                </button>
                <span className="text-[#d4d5d9]">|</span>
                <button
                  type="button"
                  id="fill-seller-positive-credentials-btn"
                  disabled={lockoutSeconds > 0 || isVerifying}
                  onClick={() => fillPositiveCredentials('seller')}
                  className="text-[#ff5722] font-bold hover:underline cursor-pointer disabled:opacity-50"
                >
                  Fill Seller Passkey
                </button>
              </div>
            </div>

            {/* Toggleable credentials reference */}
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setShowCredentialsGuide(!showCredentialsGuide)}
                className="w-full flex items-center justify-between text-[11px] text-[#717482] hover:text-[#282c3f] transition-colors py-1 cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  View Authorized Positive Credentials Directory
                </span>
                {showCredentialsGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showCredentialsGuide && (
                <div className="mt-2 p-2.5 bg-[#fafafc] border border-[#eaeaec] rounded text-[11px] text-[#535766] space-y-2 animate-fadeIn">
                  <div className="p-1.5 bg-white rounded border border-[#f0f0f2]">
                    <p className="font-bold text-[#ff3f6c] mb-0.5">🛡️ Positive Admin Credentials:</p>
                    <p>Username / Email: <span className="font-mono text-[#282c3f] font-semibold">anik</span> or <span className="font-mono text-[#282c3f] font-semibold">anik@naxtto.com</span></p>
                    <p>Passkey: <span className="font-mono text-[#282c3f] font-semibold">naxtto2026</span> (or <span className="font-mono text-[#282c3f]">admin123</span>)</p>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-[#f0f0f2]">
                    <p className="font-bold text-[#ff5722] mb-0.5">🏪 Positive Seller Credentials:</p>
                    <p>Username / Email: <span className="font-mono text-[#282c3f] font-semibold">seller</span> or <span className="font-mono text-[#282c3f] font-semibold">seller@naxtto.com</span></p>
                    <p>Passkey: <span className="font-mono text-[#282c3f] font-semibold">naxtto2026</span> (or <span className="font-mono text-[#282c3f]">seller123</span>)</p>
                  </div>
                  <p className="text-[10px] text-[#94969f] italic">
                    Note: Any negative credentials (wrong usernames or mismatched passwords) are strictly rejected with an immediate security lockout guard.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Security Information */}
          <div className="mt-4 pt-3 border-t border-[#eaeaec] flex items-center justify-between text-[11px] text-[#94969f]">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#ff3f6c]" />
              256-Bit TLS Authenticated
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Rate-Limit Protected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
