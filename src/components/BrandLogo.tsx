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
 * - Clean solid chocolate bronze linework with precise sacred geometric curves
 * - Pointed gothic central petal with apex and bottom intersection
 * - Stepped dual-tier outer petals with sharp geometric tips
 * - Central vertical opening at the grounded base
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
  embossed = false
}) => {
  return (
    <svg
      viewBox="0 0 1000 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass || className} shrink-0 transition-transform duration-300`}
      aria-label="NaxtTo Official Lotus Emblem"
    >
      <g
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
      >
        {/* Top Central Pointed Petal */}
        <path
          d="M 500 32 
             C 425 115, 370 180, 370 250 
             C 370 345, 440 415, 500 445 
             C 560 415, 630 345, 630 250 
             C 630 180, 575 115, 500 32 Z"
        />

        {/* Upper Left Petal with Sharp Point (tip at 250, 195) */}
        <path
          d="M 370 250 
             C 330 225, 290 205, 250 195 
             C 255 240, 255 290, 250 340"
        />

        {/* Upper Right Petal with Sharp Point (tip at 750, 195) */}
        <path
          d="M 630 250 
             C 670 225, 710 205, 750 195 
             C 745 240, 745 290, 750 340"
        />

        {/* Outermost Lower Left Petal (tip at 120, 340, sweeping to base) */}
        <path
          d="M 250 340 
             C 205 338, 160 338, 120 340 
             C 165 470, 260 590, 450 648 
             L 480 648"
        />

        {/* Outermost Lower Right Petal (tip at 880, 340, sweeping to base) */}
        <path
          d="M 750 340 
             C 795 338, 840 338, 880 340 
             C 835 470, 740 590, 550 648 
             L 520 648"
        />

        {/* Inner Left Mid-Tier Arc */}
        <path
          d="M 250 340 
             C 330 440, 410 550, 465 648"
        />

        {/* Inner Right Mid-Tier Arc */}
        <path
          d="M 750 340 
             C 670 440, 590 550, 535 648"
        />

        {/* Central Lower Flame Void */}
        <path
          d="M 480 648 
             C 445 540, 460 470, 500 445 
             C 540 470, 555 540, 520 648"
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
      embossed: false
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
      embossed: false
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


