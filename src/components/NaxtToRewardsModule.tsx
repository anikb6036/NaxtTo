import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Crown, 
  Coins, 
  Gift, 
  ChevronRight, 
  Check, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Tag, 
  ExternalLink,
  Info
} from 'lucide-react';
import { UserProfile, Order } from '../types';

interface NaxtToRewardsModuleProps {
  user: UserProfile;
  orders?: Order[];
  currencySymbol?: string;
  onNavigateToShop?: () => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export type RewardsTier = 'NaxtTo Circle' | 'Atelier Connoisseur' | 'VIP Privé';

interface TierDefinition {
  name: RewardsTier;
  minPoints: number;
  maxPoints: number;
  multiplier: string;
  badgeColor: string;
  accentGradient: string;
  benefits: string[];
}

const REWARDS_TIERS: TierDefinition[] = [
  {
    name: 'NaxtTo Circle',
    minPoints: 0,
    maxPoints: 2500,
    multiplier: '5 Pts per ₹100',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    accentGradient: 'from-slate-700 to-slate-900',
    benefits: [
      'Complimentary Armored & Insured Transit on all orders',
      'Annual Patron Anniversary Bonus (500 Pts)',
      'Digital Certificate of BIS Hallmark Authenticity',
      'Standard 15-Day Inspection & Exchange Policy'
    ]
  },
  {
    name: 'Atelier Connoisseur',
    minPoints: 2501,
    maxPoints: 10000,
    multiplier: '7.5 Pts per ₹100',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    accentGradient: 'from-amber-600 via-amber-700 to-amber-900',
    benefits: [
      'Annual Ultrasonic Gold Spa & Prong Tightening Service',
      '48-Hour Early Access to Archival Bridal Drops',
      'Birthday Month 10% Extra Points Multiplier',
      'Complimentary Personalized Jewellery Care Pouch'
    ]
  },
  {
    name: 'VIP Privé',
    minPoints: 10001,
    maxPoints: Infinity,
    multiplier: '10 Pts per ₹100',
    badgeColor: 'bg-rose-100 text-[#D45974] border-rose-300',
    accentGradient: 'from-rose-600 via-pink-700 to-rose-950',
    benefits: [
      'Direct Private Consultation with Milan Master Karigars',
      'Priority Bespoke Commissioning in Gold Workshop',
      'Unlimited Free Ring Resizing & Hallmark Recertification',
      'Private High-Value Vault Consignments with White-Glove Handover'
    ]
  }
];

export const NaxtToRewardsModule: React.FC<NaxtToRewardsModuleProps> = ({
  user,
  orders = [],
  currencySymbol = '₹',
  onNavigateToShop,
  onUpdateUser
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);
  const [selectedRedeemAmount, setSelectedRedeemAmount] = useState<number>(500);

  // Compute accumulated points based on user data and order history
  const { totalPoints, currentTier, nextTier, progressPercent, pointsToNextTier, availableBalance, pointsHistory } = useMemo(() => {
    // Calculate points earned from completed/placed orders (5% value in points)
    const orderPoints = orders.reduce((sum, order) => {
      if (order.status !== 'Cancelled') {
        return sum + Math.round((order.total || 0) * 0.05);
      }
      return sum;
    }, 0);

    // Initial welcome reward for verified patrons
    const welcomeBonus = 750;
    
    // User profile stored points or calculated base points
    const accumulated = typeof user.rewardPoints === 'number' 
      ? user.rewardPoints 
      : (welcomeBonus + (orderPoints > 0 ? orderPoints : 1450));

    // Determine current tier
    let tier: TierDefinition = REWARDS_TIERS[0];
    let next: TierDefinition | null = REWARDS_TIERS[1];

    if (accumulated >= 10001) {
      tier = REWARDS_TIERS[2];
      next = null;
    } else if (accumulated >= 2501) {
      tier = REWARDS_TIERS[1];
      next = REWARDS_TIERS[2];
    } else {
      tier = REWARDS_TIERS[0];
      next = REWARDS_TIERS[1];
    }

    // Tier Progress calculation
    let progress = 100;
    let needed = 0;
    if (next) {
      const range = next.minPoints - tier.minPoints;
      const currentProgress = accumulated - tier.minPoints;
      progress = Math.min(100, Math.max(5, Math.round((currentProgress / range) * 100)));
      needed = Math.max(0, next.minPoints - accumulated);
    }

    // Monetary valuation: 1 point = 1 Rupee (₹1)
    const balance = accumulated;

    // Build Activity Ledger
    const history = [
      {
        id: 'pts-1',
        title: 'Patron Welcome Induction Gift',
        description: 'Complimentary privilege points upon account registration',
        points: +750,
        date: user.memberSince || 'Recent',
        type: 'credit'
      },
      ...orders.slice(0, 3).map((o, idx) => ({
        id: `pts-ord-${o.id || idx}`,
        title: `Consignment #${o.orderNumber || 'NXT-884920'} Acquisition`,
        description: `Loyalty points credited for fine jewellery order (${o.items?.length || 1} pieces)`,
        points: +Math.round((o.total || 45000) * 0.05),
        date: o.date || 'Recent',
        type: 'credit'
      })),
      {
        id: 'pts-bis',
        title: 'BIS Hallmark Authentication Milestone',
        description: 'First handcrafted 22K Gold Badhano registration',
        points: +450,
        date: 'Verified',
        type: 'credit'
      }
    ];

    return {
      totalPoints: accumulated,
      currentTier: tier,
      nextTier: next,
      progressPercent: progress,
      pointsToNextTier: needed,
      availableBalance: balance,
      pointsHistory: history
    };
  }, [user, orders]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleGenerateVoucher = (amount: number) => {
    if (amount > totalPoints) return;
    const voucherCode = `NAXTTO-REWARD-${amount}`;
    navigator.clipboard.writeText(voucherCode);
    setCopiedCode(voucherCode);
    setRedeemSuccessMsg(`Voucher code "${voucherCode}" copied! Use it at checkout to claim ${currencySymbol}${amount.toLocaleString('en-IN')} off.`);
    setTimeout(() => setRedeemSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="naxtto-rewards-program-module">
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e5e5ea] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
              NaxtTo Rewards Program
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E56A85]/10 text-[#D45974] border border-[#E56A85]/20 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span>Privilege Club</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
            Your personal treasury of loyalty points, tier privileges, and checkout balance
          </p>
        </div>

        {onNavigateToShop && (
          <button
            type="button"
            onClick={onNavigateToShop}
            className="self-start sm:self-auto px-4 py-2 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Explore Salon Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Treasury Hero Card: 3 Core Metrics (Points, Tier, Available Balance) */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-200/80 bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#1c1917] text-white p-6 sm:p-8 shadow-md">
        
        {/* Subtle Decorative Ambient Golden Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#D45974]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Column: Points & Tier */}
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-amber-400/20 to-amber-200/10 text-amber-300 border border-amber-400/30">
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Current Tier: {currentTier.name}</span>
              </span>
              <span className="text-xs text-amber-200/70 font-medium">
                • {currentTier.multiplier}
              </span>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-amber-200/80 font-semibold mb-1">
                Accumulated Reward Points
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
                  {totalPoints.toLocaleString('en-IN')}
                </span>
                <span className="text-lg font-bold text-amber-300/90 uppercase tracking-wide">
                  Points
                </span>
              </div>
            </div>

            {/* Next Tier Progression Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs text-stone-300">
                <span>
                  Status: <strong>{currentTier.name}</strong>
                </span>
                {nextTier ? (
                  <span>
                    <strong>{pointsToNextTier.toLocaleString('en-IN')} pts</strong> to reach {nextTier.name}
                  </span>
                ) : (
                  <span className="text-amber-300 font-semibold">Maximum Privilege Tier Reached</span>
                )}
              </div>

              <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-[#E56A85] transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Available Balance for Future Purchases */}
          <div className="lg:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-300" />
                  <span>Available Balance</span>
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                  1 Pt = {currencySymbol}1
                </span>
              </div>

              <div className="mt-2">
                <div className="text-3xl font-extrabold text-white">
                  {currencySymbol}{availableBalance.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  Ready to apply directly on your next fine jewellery order.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleGenerateVoucher(Math.min(availableBalance, 1000))}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Generate Voucher Code ({currencySymbol}{Math.min(availableBalance, 1000).toLocaleString('en-IN')})</span>
              </button>

              {copiedCode && (
                <div className="p-2 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-300 text-[11px] text-center font-semibold flex items-center justify-center gap-1.5 animate-fadeIn">
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Code Copied: {copiedCode}</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Instant Redemption / Voucher Generator Panel */}
      <div className="p-6 rounded-2xl bg-white border border-[#e5e5ea] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#D45974]" />
              <span>Redeem Points for Future Purchases</span>
            </h3>
            <p className="text-xs text-[#6e6e73]">
              Convert points into instant digital vouchers valid on all Shankha-Pola and 22K Gold collections
            </p>
          </div>

          <div className="text-xs text-[#86868b] font-medium">
            Treasury Balance: <strong className="text-[#1d1d1f]">{totalPoints.toLocaleString('en-IN')} Pts</strong>
          </div>
        </div>

        {/* Amount Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[500, 1000, 2000, Math.min(totalPoints, 5000)].map((amt) => {
            const isSelected = selectedRedeemAmount === amt;
            const isAffordable = totalPoints >= amt;
            return (
              <button
                key={amt}
                type="button"
                disabled={!isAffordable}
                onClick={() => setSelectedRedeemAmount(amt)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-[#E56A85] bg-pink-50/50 ring-2 ring-[#E56A85]/20' 
                    : isAffordable 
                      ? 'border-[#e5e5ea] bg-white hover:bg-slate-50' 
                      : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-xs text-[#6e6e73] font-medium">Redeem Value</div>
                <div className="text-base font-bold text-[#1d1d1f]">{currencySymbol}{amt.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-[#86868b] mt-0.5">{amt} Points</div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Vouchers do not expire and can be combined with bank EMI offers at checkout.</span>
          </div>

          <button
            type="button"
            onClick={() => handleGenerateVoucher(selectedRedeemAmount)}
            disabled={totalPoints < selectedRedeemAmount}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#E56A85] hover:bg-[#D45974] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Claim {currencySymbol}{selectedRedeemAmount.toLocaleString('en-IN')} Voucher Code</span>
          </button>
        </div>

        {redeemSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{redeemSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Tier Benefits Comparison Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>NaxtTo Tier Privileges & Multipliers</span>
          </h3>
          <p className="text-xs text-[#6e6e73]">
            As your collection grows, unlock higher point rates, master karigar consultations, and exclusive atelier access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REWARDS_TIERS.map((tier) => {
            const isCurrent = tier.name === currentTier.name;
            return (
              <div 
                key={tier.name}
                className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  isCurrent 
                    ? 'border-amber-400 bg-amber-50/20 shadow-xs ring-1 ring-amber-400/40' 
                    : 'border-[#e5e5ea] bg-white'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 right-4 bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                    Your Current Tier
                  </span>
                )}

                <div className="space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-[#1d1d1f]">{tier.name}</h4>
                    <p className="text-xs text-[#86868b] mt-0.5">
                      {tier.maxPoints === Infinity ? '10,001+ Points' : `${tier.minPoints.toLocaleString('en-IN')} – ${tier.maxPoints.toLocaleString('en-IN')} Points`}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#f5f5f7] border border-[#e5e5ea]">
                    <div className="text-[11px] text-[#86868b] uppercase font-semibold">Reward Rate</div>
                    <div className="text-sm font-bold text-[#1d1d1f] mt-0.5">{tier.multiplier}</div>
                  </div>

                  <ul className="space-y-2 pt-2 text-xs text-[#57534e]">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-[#e5e5ea]/80">
                  {isCurrent ? (
                    <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Active for your account</span>
                    </div>
                  ) : (
                    <div className="text-xs text-[#86868b]">
                      {tier.minPoints > totalPoints 
                        ? `${(tier.minPoints - totalPoints).toLocaleString('en-IN')} pts away` 
                        : 'Unlocked'
                      }
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Points Activity / Ledger */}
      <div className="p-6 rounded-2xl bg-white border border-[#e5e5ea] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e5e5ea]">
          <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#86868b]" />
            <span>Recent Points Activity Ledger</span>
          </h3>
          <span className="text-xs text-[#86868b] font-medium">
            Total Points Logged: <strong className="text-[#1d1d1f]">{totalPoints.toLocaleString('en-IN')}</strong>
          </span>
        </div>

        <div className="divide-y divide-[#f5f5f7]">
          {pointsHistory.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-[#1d1d1f]">{item.title}</div>
                <div className="text-[#86868b]">{item.description}</div>
                <div className="text-[10px] text-[#a8a29e]">{item.date}</div>
              </div>

              <div className="text-right shrink-0">
                <span className={`inline-block font-bold text-sm ${item.type === 'credit' ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {item.type === 'credit' ? '+' : '-'}{item.points.toLocaleString('en-IN')} Pts
                </span>
                <div className="text-[10px] text-[#86868b]">
                  {currencySymbol}{item.points.toLocaleString('en-IN')} value
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default NaxtToRewardsModule;
