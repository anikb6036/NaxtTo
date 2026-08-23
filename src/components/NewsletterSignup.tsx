import React, { useState } from 'react';
import { Mail, Check, Copy, ArrowRight, ShieldCheck } from 'lucide-react';

interface NewsletterSignupProps {
  onSubscribed?: (email: string) => void;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubscribed }) => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<string[]>(['18K Solid Gold', 'New Archetypes']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const availableInterests = [
    '18K Solid Gold',
    'Ethical Lab Diamonds',
    'Organic Baroque Pearls',
    'Bespoke Commissions'
  ];

  const toggleInterest = (interest: string) => {
    if (preferences.includes(interest)) {
      setPreferences(preferences.filter(p => p !== interest));
    } else {
      setPreferences([...preferences, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setIsSubmitted(true);
    if (onSubscribed) {
      onSubscribed(email);
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('NAXTTO10');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="newsletter-section" className="w-full bg-white text-[#1d1d1f] py-20 relative overflow-hidden border-t border-[#e5e5ea] font-sans">
      {/* Subtle architectural background ambiance */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#f5f5f7] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#e5e5ea] rounded-full blur-3xl opacity-40" />
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-12 relative z-10 text-center space-y-8">
        {/* Header Content */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1d1d1f]/5 border border-[#1d1d1f]/10 text-xs text-[#1d1d1f] font-medium">
            <span>The NaxtTo Circle</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] leading-snug">
            Receive private salon invites & <br />
            <span className="text-[#6e6e73]">10% off your initial piece.</span>
          </h2>

          <p className="text-sm text-[#6e6e73] font-normal leading-relaxed">
            Subscribe to our weekly dispatch for private salon announcements, new metallurgical releases, and archival guides directly from our Milan atelier.
          </p>
        </div>

        {/* Form or Success State */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5 font-sans">
            {/* Input & Action */}
            <div className="flex flex-col sm:flex-row gap-2 bg-[#f5f5f7] p-1.5 rounded-full border border-[#e5e5ea] shadow-xs focus-within:border-[#1d1d1f] focus-within:bg-white transition-all">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none font-sans"
                />
                <Mail className="w-4 h-4 text-[#86868b] absolute right-3 top-1/2 -translate-y-1/2 hidden sm:block" />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#1d1d1f] hover:bg-black text-white text-[10px] uppercase tracking-[0.22em] font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-2 group shrink-0"
              >
                <span>Join Circle</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-[#c5a059]" />
              </button>
            </div>

            {/* Interest Preference Checkboxes */}
            <div className="space-y-2">
              <span className="text-[9px] text-[#8c827a] tracking-[0.2em] uppercase font-semibold block">
                Tailor your metallurgical preferences:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {availableInterests.map((interest) => {
                  const isChecked = preferences.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all border ${
                        isChecked
                          ? 'bg-[#1c1a18] text-white border-[#1c1a18] font-bold shadow-xs'
                          : 'bg-white text-[#736c64] border-[#d8cebf] hover:border-[#1c1a18]'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-[#8c827a] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                Zero Spam • Unsubscribe anytime in 1-click
              </span>
            </div>
          </form>
        ) : (
          /* Instant Success State with Discount Code */
          <div className="max-w-md mx-auto p-6 bg-white border border-[#d8cebf] rounded-xs space-y-4 shadow-lg animate-scaleIn">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-serif text-xl text-[#1c1a18] font-light">Welcome to the NaxtTo Circle</h3>
              <p className="text-xs text-[#736c64] font-serif italic mt-1">
                Your private welcome invitation has been sent to <strong>{email}</strong>. Use your exclusive client code below during checkout:
              </p>
            </div>

            {/* Coupon Code Pill with Copy */}
            <div className="flex items-center justify-between p-3.5 bg-[#f4efe8] border border-[#d8cebf] rounded-xs">
              <div className="text-left font-sans">
                <span className="text-[9px] text-[#8c827a] uppercase tracking-wider block font-bold">10% Atelier Discount Code</span>
                <span className="font-mono text-base font-bold text-[#1c1a18]">NAXTTO10</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="px-3.5 py-1.5 bg-[#1c1a18] hover:bg-[#2d2a26] text-white text-[10px] font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors font-sans shadow-xs"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
