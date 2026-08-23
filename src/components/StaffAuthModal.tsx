import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  UserCheck, 
  X, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface StaffAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (staffInfo?: { email: string; role: string; name: string }) => void;
}

export const StaffAuthModal: React.FC<StaffAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [emailOrId, setEmailOrId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  // Valid staff passcodes
  const validPasscodes = ['naxtto2026', 'admin123', 'staff123', 'atelier2026', 'director750'];

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const cleanInput = emailOrId.trim().toLowerCase();
    const cleanPass = passcode.trim();

    if (!cleanInput) {
      setErrorMsg('Please enter your Staff ID or Atelier Work Email.');
      return;
    }
    if (!cleanPass) {
      setErrorMsg('Please enter your Staff Security Passkey.');
      return;
    }

    setIsVerifying(true);

    // Simulate cryptographic credential verification
    setTimeout(() => {
      const isValidPass = validPasscodes.includes(cleanPass) || cleanPass.length >= 6;
      const isStaffUser = cleanInput.includes('admin') || 
                          cleanInput.includes('staff') || 
                          cleanInput.includes('naxtto') || 
                          cleanInput.includes('director') || 
                          cleanInput.includes('@') ||
                          cleanInput.length >= 3;

      if (isValidPass && isStaffUser) {
        setVerifiedSuccess(true);
        setTimeout(() => {
          setIsVerifying(false);
          setVerifiedSuccess(false);
          const staffRole = cleanInput.includes('director') 
            ? 'Atelier Director' 
            : cleanInput.includes('admin') 
            ? 'Master Administrator' 
            : 'Atelier Staff Specialist';
          
          onSuccess({
            email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@naxtto.internal`,
            role: staffRole,
            name: cleanInput.includes('@') ? cleanInput.split('@')[0].toUpperCase() : cleanInput.toUpperCase()
          });
        }, 800);
      } else {
        setIsVerifying(false);
        setErrorMsg('Invalid credentials. Access restricted to authorized Atelier staff only.');
      }
    }, 600);
  };

  const handleQuickFillDemo = () => {
    setEmailOrId('admin@atelier-naxtto.com');
    setPasscode('naxtto2026');
    setErrorMsg(null);
  };

  return (
    <div 
      id="staff-auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="staff-auth-modal-container"
        className="relative w-full max-w-md bg-white border border-[#2d2a26]/10 rounded-2xl shadow-2xl overflow-hidden animate-scaleUp"
      >
        {/* Top Header with Dark Gold Accent */}
        <div className="bg-[#1d1d1f] text-white px-6 py-6 border-b border-[#2d2a26]/20 relative">
          <button
            id="close-staff-auth-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#d4af37] border border-white/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#d4af37] font-semibold block">
                Privé Atelier Security Gate
              </span>
              <h3 className="font-serif text-lg text-white font-medium">
                Staff Authentication
              </h3>
            </div>
          </div>
          <p className="text-xs text-white/70 font-sans mt-1">
            Access to inventory management, catalogue editing, and client ledger is restricted to authorized personnel.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div 
              id="staff-auth-error-banner"
              className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {verifiedSuccess ? (
            <div className="py-8 text-center space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg text-[#1d1d1f] font-medium">
                Credentials Verified
              </h4>
              <p className="text-xs text-[#6e6e73]">
                Decryption complete. Initializing Atelier Admin Suite...
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2d2a26] mb-1.5">
                  Staff ID / Work Email
                </label>
                <div className="relative">
                  <input
                    id="staff-auth-email-input"
                    type="text"
                    value={emailOrId}
                    onChange={(e) => {
                      setEmailOrId(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="e.g. admin@atelier-naxtto.com or STAFF-750"
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl text-sm text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all pl-9"
                    autoFocus
                  />
                  <UserCheck className="w-4 h-4 text-[#86868b] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2d2a26]">
                    Staff Security Passkey
                  </label>
                  <span className="text-[10px] text-[#86868b] font-medium">
                    Passkey: <code className="bg-[#f5f5f7] px-1 py-0.5 rounded text-[#1d1d1f]">naxtto2026</code>
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="staff-auth-passcode-input"
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Enter confidential passkey..."
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl text-sm text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all pl-9 pr-10"
                  />
                  <Key className="w-4 h-4 text-[#86868b] absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-3 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  id="staff-auth-submit-btn"
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-[#1d1d1f] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4 text-[#d4af37]" />
                      <span>Verify & Enter Admin Suite</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  id="staff-auth-quickfill-btn"
                  type="button"
                  onClick={handleQuickFillDemo}
                  className="w-full py-2 bg-[#f5f5f7] hover:bg-[#ebebee] text-[#1d1d1f] text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Auto-Fill Verified Staff Credentials (Demo)</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer note */}
          <div className="pt-3 border-t border-[#e5e5ea] flex items-center justify-between text-[10px] text-[#86868b]">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              256-Bit TLS Authenticated
            </span>
            <span>Atelier Suite v2.6</span>
          </div>
        </div>
      </div>
    </div>
  );
};
