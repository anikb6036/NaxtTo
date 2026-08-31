import React from 'react';

export interface BrandLogoProps {
  layout?: 'vertical' | 'horizontal' | 'icon-only' | 'text-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'original' | 'custom';
  variant?: 'dark' | 'light' | 'bronze' | 'gold' | 'champagne' | 'embossed' | 'monochrome' | 'inherit';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  onClick?: () => void;
  id?: string;
}

/**
 * Geometric Luxury Lotus Emblem matching the exact original NaxtTo brand identity from the official reference
 * Features:
 * - Gothic central apex spire with inner intersecting arch
 * - Split central flame void with vertical base gap
 * - Dual-tier stepped outer wings with sharp geometric top edges
 * - Metallic 3D bevel / bronze relief finish and scalable vector precision
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
  strokeWidth = 2.4,
  color = "#3E271D",
  embossed = true
}) => {
  return (
    <svg
      viewBox="0 0 1000 920"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass || className} shrink-0 transition-transform duration-300`}
      aria-label="NaxtTo Official Lotus Emblem"
    >
      <defs>
        {/* Rich Metallic Bronze Gradients matching the original reference */}
        <linearGradient id="naxtto-metal-body" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#4A3125" />
          <stop offset="30%" stopColor="#382117" />
          <stop offset="70%" stopColor="#2D1910" />
          <stop offset="100%" stopColor="#452C20" />
        </linearGradient>

        <linearGradient id="naxtto-rim-light" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A88B77" stopOpacity="0.8" />
          <stop offset="25%" stopColor="#553A2C" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#CBB5A1" stopOpacity="0.9" />
          <stop offset="75%" stopColor="#553A2C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#A88B77" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="naxtto-gold-lux" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5CE93" />
          <stop offset="35%" stopColor="#C5A059" />
          <stop offset="70%" stopColor="#99752D" />
          <stop offset="100%" stopColor="#D4B46E" />
        </linearGradient>

        {/* Realistic drop shadow and metallic relief filter */}
        <filter id="naxtto-shadow" x="-8%" y="-8%" width="120%" height="120%">
          <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#1A0E08" floodOpacity="0.35" />
          <feDropShadow dx="-1" dy="-1" stdDeviation="2" floodColor="#FFF6ED" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={embossed ? "url(#naxtto-shadow)" : undefined}>
        {/* ==================== LEFT HALF ==================== */}
        {/* Left Wing (Outermost lower petal) */}
        <path
          d="M 145 435 
             L 272 485 
             C 285 580, 360 760, 480 875 
             L 458 875 
             C 325 750, 240 580, 174 470 
             L 145 470 
             Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
          stroke={color === "#3E271D" ? "url(#naxtto-rim-light)" : color}
          strokeWidth="4"
          strokeLinejoin="miter"
        />

        {/* Left Outer Sweep Base Arc Ribbon */}
        <path
          d="M 145 435 
             L 174 470 
             C 240 640, 340 810, 480 875 
             L 500 875 
             C 340 810, 220 620, 145 435 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
        />

        {/* Left Upper Tier Petal */}
        <path
          d="M 268 300 
             L 375 330 
             C 390 410, 435 550, 480 875 
             L 458 875 
             C 415 570, 365 425, 298 335 
             L 268 300 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
          stroke={color === "#3E271D" ? "url(#naxtto-rim-light)" : color}
          strokeWidth="3.5"
          strokeLinejoin="miter"
        />

        {/* Left Mid Petal Rib Loop */}
        <path
          d="M 268 300 
             L 298 335 
             C 350 490, 410 680, 480 875 
             L 458 875 
             C 390 680, 320 480, 268 300 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
        />

        {/* Left Inner Rib (flanking central void) */}
        <path
          d="M 375 330 
             C 425 450, 470 610, 480 875 
             L 458 875 
             C 445 630, 405 470, 375 330 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
        />

        {/* ==================== RIGHT HALF ==================== */}
        {/* Right Wing (Outermost lower petal) */}
        <path
          d="M 855 435 
             L 728 485 
             C 715 580, 640 760, 520 875 
             L 542 875 
             C 675 750, 760 580, 826 470 
             L 855 470 
             Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
          stroke={color === "#3E271D" ? "url(#naxtto-rim-light)" : color}
          strokeWidth="4"
          strokeLinejoin="miter"
        />

        {/* Right Outer Sweep Base Arc Ribbon */}
        <path
          d="M 855 435 
             L 826 470 
             C 760 640, 660 810, 520 875 
             L 500 875 
             C 660 810, 780 620, 855 435 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
        />

        {/* Right Upper Tier Petal */}
        <path
          d="M 732 300 
             L 625 330 
             C 610 410, 565 550, 520 875 
             L 542 875 
             C 585 570, 635 425, 702 335 
             L 732 300 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
          stroke={color === "#3E271D" ? "url(#naxtto-rim-light)" : color}
          strokeWidth="3.5"
          strokeLinejoin="miter"
        />

        {/* Right Mid Petal Rib Loop */}
        <path
          d="M 732 300 
             L 702 335 
             C 650 490, 590 680, 520 875 
             L 542 875 
             C 610 680, 680 480, 732 300 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
        />

        {/* Right Inner Rib (flanking central void) */}
        <path
          d="M 625 330 
             C 575 450, 530 610, 520 875 
             L 542 875 
             C 555 630, 595 470, 625 330 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
        />

        {/* ==================== CENTRAL APEX SPIRE & HEART ==================== */}
        {/* Top Central Spire Gothic Outer Shell */}
        <path
          d="M 500 95 
             C 455 170, 390 275, 375 330
             C 410 440, 465 500, 500 535
             C 535 500, 590 440, 625 330
             C 610 275, 545 170, 500 95 Z"
          fill="none"
          stroke={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
          strokeWidth="28"
          strokeLinejoin="round"
        />

        {/* Central Inverted Gothic Arch / Split Core Frame */}
        <path
          d="M 500 535 
             C 475 570, 455 670, 458 875 
             L 480 875 
             C 480 670, 495 580, 500 545 
             C 505 580, 520 670, 520 875 
             L 542 875 
             C 545 670, 525 570, 500 535 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
          stroke={color === "#3E271D" ? "url(#naxtto-rim-light)" : color}
          strokeWidth="3"
        />

        {/* High-Precision Continuous Filigree Outlines matching photo bevels */}
        {/* Left main cradle */}
        <path
          d="M 145 435 C 190 650, 310 820, 480 875 L 458 875 C 300 815, 185 640, 145 470 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
          stroke={color === "#3E271D" ? "url(#naxtto-rim-light)" : color}
          strokeWidth="2.5"
        />
        {/* Right main cradle */}
        <path
          d="M 855 435 C 810 650, 690 820, 520 875 L 542 875 C 700 815, 815 640, 855 470 Z"
          fill={color === "#3E271D" ? "url(#naxtto-metal-body)" : color}
          stroke={color === "#3E271D" ? "url(#naxtto-rim-light)" : color}
          strokeWidth="2.5"
        />

        {/* Top apex highlight accent */}
        <path
          d="M 500 95 L 498 120 C 530 180, 580 270, 608 335 L 625 330 C 590 250, 535 150, 500 95 Z"
          fill={color === "#3E271D" ? "url(#naxtto-rim-light)" : color}
          opacity="0.6"
        />
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
  className = '',
  onClick,
  id
}) => {
  // Variant Colors
  const colorMap = {
    bronze: {
      icon: '#3E271D',
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
      icon: '#3E271D',
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
      icon: 'w-4 h-4',
      title: 'text-sm tracking-[0.20em]',
      subtitle: 'text-[7px] tracking-[0.26em]',
      dividerWidth: 'max-w-[80px]',
      gap: 'gap-2'
    },
    sm: {
      icon: 'w-6 h-6',
      title: 'text-base sm:text-lg tracking-[0.22em]',
      subtitle: 'text-[8px] tracking-[0.28em]',
      dividerWidth: 'max-w-[100px]',
      gap: 'gap-2.5'
    },
    md: {
      icon: 'w-8 h-8 sm:w-9 sm:h-9',
      title: 'text-xl sm:text-[22px] tracking-[0.22em]',
      subtitle: 'text-[8.5px] sm:text-[9.5px] tracking-[0.30em]',
      dividerWidth: 'max-w-[130px]',
      gap: 'gap-3'
    },
    lg: {
      icon: 'w-11 h-11',
      title: 'text-2xl sm:text-3xl tracking-[0.24em]',
      subtitle: 'text-xs tracking-[0.32em]',
      dividerWidth: 'max-w-[160px]',
      gap: 'gap-3.5'
    },
    xl: {
      icon: 'w-16 h-16',
      title: 'text-3xl sm:text-4xl tracking-[0.26em]',
      subtitle: 'text-xs sm:text-sm tracking-[0.34em]',
      dividerWidth: 'max-w-[200px]',
      gap: 'gap-4'
    },
    '2xl': {
      icon: 'w-24 h-24',
      title: 'text-4xl sm:text-5xl tracking-[0.28em]',
      subtitle: 'text-sm sm:text-base tracking-[0.36em]',
      dividerWidth: 'max-w-[240px]',
      gap: 'gap-4.5'
    },
    original: {
      icon: 'w-28 h-28 sm:w-36 sm:h-36',
      title: 'text-4xl sm:text-5xl md:text-6xl tracking-[0.28em]',
      subtitle: 'text-xs sm:text-sm tracking-[0.38em]',
      dividerWidth: 'max-w-[280px]',
      gap: 'gap-4'
    },
    custom: {
      icon: 'w-8 h-8',
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
      {/* Lotus Emblem Icon (Original geometry from NaxtTo reference) */}
      {layout !== 'text-only' && (
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


