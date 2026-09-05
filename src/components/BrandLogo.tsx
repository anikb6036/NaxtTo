import React from 'react';

export interface BrandLogoProps {
  layout?: 'vertical' | 'horizontal' | 'icon-only' | 'text-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'original' | 'custom';
  variant?: 'dark' | 'light' | 'bronze' | 'gold' | 'champagne' | 'embossed' | 'monochrome' | 'inherit';
  showSubtitle?: boolean;
  subtitleText?: string;
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
  id?: string;
}

/**
 * Geometric Luxury Lotus Emblem matching the official reference logo provided by user
 * Features:
 * - Sacred geometric curves matching official NaxtTo metallic emblem (NaxtTo - Copy.png)
 * - Pointed gothic central petal with apex and bottom junction
 * - Stepped dual-tier outer petals with sharp geometric tips (mid tips and horizontal wing tips)
 * - Sweeping bowl contour arching down to grounded base
 * - Central vertical opening and flame stems at the base
 * - Metallic bronze polished gradient with subtle ambient elevation
 */
export const LotusEmblem: React.FC<{
  className?: string;
  sizeClass?: string;
  strokeWidth?: number;
  color?: string;
  embossed?: boolean;
}> = ({ 
  className = "w-8 h-8", 
  sizeClass, 
  strokeWidth = 26,
  color = "#54280E",
  embossed = true
}) => {
  const gradientId = React.useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 1000 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass || className} shrink-0 transition-transform duration-300`}
      aria-label="NaxtTo Official Lotus Emblem"
    >
      <defs>
        {/* Luxury Metallic Bronze Gradient matching official emblem photo */}
        <linearGradient id={`bronze-${gradientId}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#7E4A28" />
          <stop offset="25%" stopColor="#B3865B" />
          <stop offset="50%" stopColor="#5E2C10" />
          <stop offset="75%" stopColor="#8C5832" />
          <stop offset="100%" stopColor="#3F1B07" />
        </linearGradient>

        {/* 18k Champagne Gold Gradient */}
        <linearGradient id={`gold-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="35%" stopColor="#F5E2A8" />
          <stop offset="70%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>

        {/* Soft Ambient Occlusion Shadow filter */}
        <filter id={`shadow-${gradientId}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#281105" floodOpacity="0.28" />
        </filter>
      </defs>

      <g
        stroke={
          color === '#54280E' || color === 'bronze' 
            ? `url(#bronze-${gradientId})` 
            : color === '#C5A059' || color === '#D4AF37'
            ? `url(#gold-${gradientId})`
            : color
        }
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeMiterlimit={8}
        filter={embossed && (color === '#54280E' || color === 'bronze') ? `url(#shadow-${gradientId})` : undefined}
      >
        {/* 1. Top Central Pointed Gothic Petal */}
        <path
          d="M 500 96 
             C 420 180, 365 265, 365 360 
             C 365 450, 430 515, 500 545 
             C 570 515, 635 450, 635 360 
             C 635 265, 580 180, 500 96 Z"
        />

        {/* 2. Lower Central Inner Stems (flanking the bottom central vertical gap) */}
        {/* Left inner stem */}
        <path
          d="M 500 545 
             C 455 620, 440 730, 478 930"
        />
        {/* Right inner stem */}
        <path
          d="M 500 545 
             C 545 620, 560 730, 522 930"
        />

        {/* 3. Mid-Tier Petals with Sharp Pointed Tips */}
        {/* Upper Left Mid Petal (sharp tip at 265, 320) */}
        <path
          d="M 365 360 
             C 330 340, 295 330, 265 320 
             C 270 375, 270 425, 265 480"
        />
        {/* Upper Right Mid Petal (sharp tip at 735, 320) */}
        <path
          d="M 635 360 
             C 670 340, 705 330, 735 320 
             C 730 375, 730 425, 735 480"
        />

        {/* 4. Mid-Tier Downward Arcs to Base */}
        {/* Left mid-tier inner sweep */}
        <path
          d="M 265 480 
             C 335 570, 410 700, 460 930"
        />
        {/* Right mid-tier inner sweep */}
        <path
          d="M 735 480 
             C 665 570, 590 700, 540 930"
        />

        {/* 5. Outermost Wing Petals with Sharp Horizontal Tips & Sweeping Bowl */}
        {/* Outermost Lower Left Wing (horizontal sharp tip at 142, 465 sweeping to base) */}
        <path
          d="M 265 480 
             C 220 475, 178 470, 142 465 
             C 185 645, 275 825, 460 930"
        />
        {/* Outermost Lower Right Wing (horizontal sharp tip at 858, 465 sweeping to base) */}
        <path
          d="M 735 480 
             C 780 475, 822 470, 858 465 
             C 815 645, 725 825, 540 930"
        />

        {/* 6. Base Grounding Caps (framing the central vertical void) */}
        <path d="M 460 930 L 478 930" />
        <path d="M 522 930 L 540 930" />
      </g>
    </svg>
  );
};

/**
 * Geometric Diamond Accent Rule Bar matching the original NaxtTo signature divider
 */
export const NaxtToDivider: React.FC<{
  color?: string;
  className?: string;
  width?: string;
}> = ({
  color = "#3E271D",
  className = "my-1.5",
  width = "w-full max-w-[140px]"
}) => {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${width} ${className} opacity-85 select-none`}>
      {/* Left Hairline Rule */}
      <div className="h-[0.75px] flex-1" style={{ backgroundColor: color }} />
      
      {/* Left Small Dot/Diamond */}
      <div 
        className="w-1 h-1 rotate-45 shrink-0" 
        style={{ backgroundColor: color }} 
      />
      
      {/* Central Statement Diamond */}
      <div 
        className="w-1.5 h-1.5 rotate-45 shrink-0 scale-110" 
        style={{ backgroundColor: color }} 
      />
      
      {/* Right Small Dot/Diamond */}
      <div 
        className="w-1 h-1 rotate-45 shrink-0" 
        style={{ backgroundColor: color }} 
      />
      
      {/* Right Hairline Rule */}
      <div className="h-[0.75px] flex-1" style={{ backgroundColor: color }} />
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  layout = 'horizontal',
  size = 'md',
  variant = 'bronze',
  showSubtitle = false,
  subtitleText = 'FINE JEWELLERY',
  showIcon = true,
  className = '',
  onClick,
  id
}) => {
  // Variant Colors
  const colorMap = {
    bronze: {
      icon: '#54280E',
      text: 'text-[#3E271D]',
      subtitle: 'text-[#5E4234]',
      divider: '#3E271D',
      embossed: true
    },
    dark: {
      icon: '#2A1810',
      text: 'text-[#1D1D1F]',
      subtitle: 'text-[#5E4234]',
      divider: '#2A1810',
      embossed: false
    },
    embossed: {
      icon: '#54280E',
      text: 'text-[#3E271D] drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]',
      subtitle: 'text-[#5E4234]',
      divider: '#3E271D',
      embossed: true
    },
    light: {
      icon: '#FDFCFB',
      text: 'text-[#FDFCFB]',
      subtitle: 'text-[#D6CEC6]',
      divider: '#FDFCFB',
      embossed: false
    },
    gold: {
      icon: '#C5A059',
      text: 'text-[#3E271D]',
      subtitle: 'text-[#C5A059]',
      divider: '#C5A059',
      embossed: false
    },
    champagne: {
      icon: '#D4AF37',
      text: 'text-[#D4AF37]',
      subtitle: 'text-[#D4AF37]/80',
      divider: '#D4AF37',
      embossed: false
    },
    monochrome: {
      icon: 'currentColor',
      text: 'text-current',
      subtitle: 'text-current opacity-75',
      divider: 'currentColor',
      embossed: false
    },
    inherit: {
      icon: 'currentColor',
      text: 'text-current',
      subtitle: 'text-current opacity-75',
      divider: 'currentColor',
      embossed: false
    }
  };

  const currentColors = colorMap[variant] || colorMap.bronze;

  // Size configurations
  const sizeConfig = {
    xs: {
      icon: 'h-4 w-auto',
      title: 'text-sm tracking-[0.20em]',
      subtitle: 'text-[7px] tracking-[0.26em]',
      dividerWidth: 'max-w-[80px]',
      gap: 'gap-2'
    },
    sm: {
      icon: 'h-6 w-auto',
      title: 'text-base sm:text-lg tracking-[0.22em]',
      subtitle: 'text-[8px] tracking-[0.28em]',
      dividerWidth: 'max-w-[100px]',
      gap: 'gap-2.5'
    },
    md: {
      icon: 'h-8 sm:h-9 w-auto',
      title: 'text-xl sm:text-[22px] tracking-[0.22em]',
      subtitle: 'text-[8.5px] sm:text-[9.5px] tracking-[0.30em]',
      dividerWidth: 'max-w-[130px]',
      gap: 'gap-2.5 sm:gap-3'
    },
    lg: {
      icon: 'h-10 sm:h-11 w-auto',
      title: 'text-2xl sm:text-3xl tracking-[0.24em]',
      subtitle: 'text-xs tracking-[0.32em]',
      dividerWidth: 'max-w-[160px]',
      gap: 'gap-3.5'
    },
    xl: {
      icon: 'h-14 sm:h-16 w-auto',
      title: 'text-3xl sm:text-4xl tracking-[0.26em]',
      subtitle: 'text-xs sm:text-sm tracking-[0.34em]',
      dividerWidth: 'max-w-[200px]',
      gap: 'gap-4'
    },
    '2xl': {
      icon: 'h-20 sm:h-24 w-auto',
      title: 'text-4xl sm:text-5xl tracking-[0.28em]',
      subtitle: 'text-sm sm:text-base tracking-[0.36em]',
      dividerWidth: 'max-w-[240px]',
      gap: 'gap-4.5'
    },
    original: {
      icon: 'h-24 sm:h-32 w-auto',
      title: 'text-4xl sm:text-5xl md:text-6xl tracking-[0.28em]',
      subtitle: 'text-xs sm:text-sm tracking-[0.38em]',
      dividerWidth: 'max-w-[280px]',
      gap: 'gap-4'
    },
    custom: {
      icon: 'h-8 w-auto',
      title: 'text-xl tracking-[0.22em]',
      subtitle: 'text-[9px] tracking-[0.28em]',
      dividerWidth: 'max-w-[120px]',
      gap: 'gap-2.5'
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div
      id={id}
      className={`inline-flex items-center select-none ${
        layout === 'vertical' ? `flex-col text-center ${currentSize.gap}` : 
        layout === 'horizontal' ? `flex-row items-center ${currentSize.gap}` : ''
      } ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Lotus Emblem Icon - only rendered when explicitly enabled */}
      {(showIcon || layout === 'icon-only') && (
        <LotusEmblem
          className={`${currentSize.icon} group-hover:scale-[1.03] transition-transform duration-300`}
          color={currentColors.icon}
          embossed={currentColors.embossed}
        />
      )}

      {/* Decorative Diamond Accent Rule for vertical layout (matching NaxtTo.png) */}
      {layout === 'vertical' && (
        <NaxtToDivider 
          color={currentColors.divider} 
          width={currentSize.dividerWidth}
        />
      )}

      {/* Typography Brand Mark (NaxtTo in Original High-Contrast Luxury Serif) */}
      {layout !== 'icon-only' && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center' : 'items-start'} justify-center leading-none`}>
          <span 
            className={`font-serif font-normal ${currentSize.title} ${currentColors.text}`}
            style={{ 
              fontFamily: '"Bodoni Moda", "Didot", "Playfair Display", "Cormorant Garamond", serif',
              letterSpacing: '0.22em'
            }}
          >
            NaxtTo
          </span>
          {showSubtitle && (
            <span 
              className={`font-sans uppercase font-medium mt-1 ${currentSize.subtitle} ${currentColors.subtitle}`}
              style={{ letterSpacing: '0.28em' }}
            >
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return content;
};


