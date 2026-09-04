import React, { useEffect } from 'react';
import { X, LogIn, Lock, ShoppingBag, Heart, ArrowRight, MessageSquarePlus } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  productName?: string;
  actionType?: 'bag' | 'wishlist' | 'review';
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  onGoToLogin,
  productName,
  actionType = 'bag'
}) => {
  // Prevent scrolling when modal is open and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isWishlist = actionType === 'wishlist';
  const isReview = actionType === 'review';

  return (
    <div
      id="login-required-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e5e5ea] overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Banner Header */}
        <div className="relative bg-gradient-to-br from-[#FFF0F4] via-[#FFE3EC] to-[#FFD5E2] pt-8 pb-6 px-6 text-center border-b border-[#FFAEC0]/30">
          {/* Close button */}
          <button
            type="button"
            id="close-login-prompt-btn"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Luxury Badge Icon */}
          <div className="mx-auto w-14 h-14 rounded-full bg-white shadow-md border border-[#FFAEC0]/40 flex items-center justify-center mb-3 text-[#E56A85]">
            <div className="relative">
              {isReview ? (
                <MessageSquarePlus className="w-6 h-6 text-[#E56A85]" />
              ) : isWishlist ? (
                <Heart className="w-6 h-6 text-[#E56A85] fill-[#E56A85]/20" />
              ) : (
                <ShoppingBag className="w-6 h-6 text-[#E56A85]" />
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#E56A85] text-white flex items-center justify-center">
                <Lock className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          <h3
            id="login-prompt-title"
            className="text-xl sm:text-2xl font-serif text-[#1d1d1f] font-normal tracking-wide"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Account Not Logged In
          </h3>

          <p className="text-xs uppercase tracking-widest text-[#E56A85] font-semibold mt-1">
            Authentication Required
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 text-center">
          <p className="text-[#3a3a3c] text-sm sm:text-base leading-relaxed">
            Your account is not logged in. <br className="hidden sm:inline" />
            <span className="font-medium text-[#1d1d1f]">
              Please login to your account
            </span>{' '}
            {isReview ? (
              <>to write a review and rate {productName ? <span className="italic font-serif">"{productName}"</span> : 'this piece'}.</>
            ) : (
              <>to {isWishlist ? 'save' : 'add'} {productName ? <span className="italic font-serif">"{productName}"</span> : (isWishlist ? 'items' : 'items')} to your {isWishlist ? 'wishlist' : 'bag'} and proceed.</>
            )}
          </p>

          <div className="mt-4 p-3 rounded-lg bg-[#FAF9F5] border border-[#E8DFD1] text-xs text-[#6e6e73] text-left">
            <p>
              {isReview
                ? 'Signing in ensures all reviews and ratings come from verified atelier patrons and genuine owners of fine jewelry.'
                : isWishlist
                ? 'Signing in lets you sync your personalized wishlist across all devices, get notified about price drops, and keep your favorite fine jewellery pieces safe.'
                : 'Signing in lets you securely manage your bag, track orders, unlock member benefits, and save your fine jewelry ring sizes and preferences.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            {/* Login Page Button */}
            <button
              type="button"
              id="go-to-login-page-btn"
              onClick={() => {
                onClose();
                onGoToLogin();
              }}
              className="w-full py-3 px-5 rounded-xl bg-[#E56A85] hover:bg-[#d65773] active:bg-[#c24661] text-white font-semibold text-sm tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer hover:shadow-lg"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>Please Login Your Account</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Dismiss / Continue Browsing */}
            <button
              type="button"
              id="dismiss-login-prompt-btn"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 transition-colors cursor-pointer"
            >
              Continue Browsing as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
