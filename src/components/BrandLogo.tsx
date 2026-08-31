import React from 'react';

export interface BrandLogoProps {
  layout?: 'vertical' | 'horizontal' | 'icon-only' | 'text-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  variant?: 'dark' | 'light' | 'bronze' | 'gold' | 'champagne' | 'monochrome' | 'inherit';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  onClick?: () => void;
  id?: string;
}

/**
 * Geometric Luxury Lotus Emblem matching the exact NaxtTo brand identity
 */
export const LotusEmblem: React.FC<{
  className?: string;
  sizeClass?: string;
  strokeWidth?: number;
  color?: string;
}> = ({ 
  className = "w-8 h-8", 
  sizeClass, 
  strokeWidth = 2.6,
  color = "#362117" 
}) => {
  return (
    <svg
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass || className} shrink-0 transition-transform duration-300`}
      aria-label="NaxtTo Lotus Emblem"
    >
      {/* 1. Outermost Sweeping Base Bowl & Wings (Left & Right) */}
      <path
        d="M 17 46 C 18 69, 33 83, 50 83 C 67 83, 82 69, 83 46"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wing top returning arcs */}
      <path
        d="M 17 46 C 21 44, 24 43, 26 43"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 83 46 C 79 44, 76 43, 74 43"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Mid-Outer Petals (Left & Right) */}
      <path
        d="M 26 36 C 29 58, 38 74, 50 83"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 74 36 C 71 58, 62 74, 50 83"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 26 36 C 29 34, 33 33, 37 34"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 74 36 C 71 34, 67 33, 63 34"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Inner Petals flanking center (Left & Right) */}
      <path
        d="M 37 25 C 41 50, 46 70, 50 83"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 63 25 C 59 50, 54 70, 50 83"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 37 25 C 41 23, 46 25, 49 32"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 63 25 C 59 23, 54 25, 51 32"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4. Central Top Almond/Pointed Leaf Outer Contour */}
      <path
        d="M 50 11 C 44 26, 43 56, 50 83 C 57 56, 56 26, 50 11 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 5. Central Inner Teardrop Heart Line */}
      <path
        d="M 50 26 C 47 44, 48 64, 50 83 C 52 64, 53 44, 50 26 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  layout = 'horizontal',
  size = 'md',
  variant = 'dark',
  showSubtitle = false,
  subtitleText = 'Fine Jewellery',
  className = '',
  onClick,
  id
}) => {
  // Variant Colors
  const colorMap = {
    dark: {
      icon: '#362117',
      text: 'text-[#362117]',
      subtitle: 'text-[#5a483e]',
      divider: '#362117'
    },
    bronze: {
      icon: '#362117',
      text: 'text-[#362117]',
      subtitle: 'text-[#5a483e]',
      divider: '#362117'
    },
    light: {
      icon: '#fdfcfb',
      text: 'text-[#fdfcfb]',
      subtitle: 'text-[#d6cec6]',
      divider: '#fdfcfb'
    },
    gold: {
      icon: '#c5a059',
      text: 'text-[#362117]',
      subtitle: 'text-[#c5a059]',
      divider: '#c5a059'
    },
    champagne: {
      icon: '#d4af37',
      text: 'text-[#d4af37]',
      subtitle: 'text-[#d4af37]/80',
      divider: '#d4af37'
    },
    monochrome: {
      icon: 'currentColor',
      text: 'text-current',
      subtitle: 'text-current opacity-70',
      divider: 'currentColor'
    },
    inherit: {
      icon: 'currentColor',
      text: 'text-current',
      subtitle: 'text-current opacity-70',
      divider: 'currentColor'
    }
  };

  const currentColors = colorMap[variant] || colorMap.dark;

  // Size configurations
  const sizeConfig = {
    xs: {
      icon: 'w-4 h-4',
      title: 'text-sm tracking-[0.2em]',
      subtitle: 'text-[7.5px] tracking-[0.28em]',
      gap: 'gap-1.5'
    },
    sm: {
      icon: 'w-6 h-6',
      title: 'text-base sm:text-lg tracking-[0.22em]',
      subtitle: 'text-[8.5px] tracking-[0.3em]',
      gap: 'gap-2'
    },
    md: {
      icon: 'w-8 h-8',
      title: 'text-xl sm:text-2xl tracking-[0.24em]',
      subtitle: 'text-[9.5px] sm:text-[10.5px] tracking-[0.32em]',
      gap: 'gap-2.5'
    },
    lg: {
      icon: 'w-10 h-10',
      title: 'text-2xl sm:text-3xl tracking-[0.26em]',
      subtitle: 'text-xs tracking-[0.34em]',
      gap: 'gap-3'
    },
    xl: {
      icon: 'w-14 h-14',
      title: 'text-3xl sm:text-4xl tracking-[0.28em]',
      subtitle: 'text-xs sm:text-sm tracking-[0.36em]',
      gap: 'gap-3.5'
    },
    '2xl': {
      icon: 'w-20 h-20',
      title: 'text-4xl sm:text-5xl tracking-[0.3em]',
      subtitle: 'text-sm tracking-[0.38em]',
      gap: 'gap-4'
    },
    custom: {
      icon: 'w-8 h-8',
      title: 'text-xl tracking-[0.24em]',
      subtitle: 'text-[10px] tracking-[0.3em]',
      gap: 'gap-2'
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div
      id={id}
      className={`inline-flex items-center select-none ${
        layout === 'vertical' ? `flex-col text-center ${currentSize.gap}` : 
        layout === 'horizontal' ? `flex-row ${currentSize.gap}` : ''
      } ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Lotus Emblem Icon */}
      {layout !== 'text-only' && (
        <LotusEmblem
          className={`${currentSize.icon} group-hover:scale-105 transition-transform duration-300`}
          color={currentColors.icon}
        />
      )}

      {/* Decorative Diamond Accent Rule for vertical layout (matching NaxtTo.png) */}
      {layout === 'vertical' && (
        <div className="flex items-center justify-center gap-1.5 w-full max-w-[120px] my-1 opacity-80">
          <div className="h-[0.5px] flex-1" style={{ backgroundColor: currentColors.divider }} />
          <div className="w-1 h-1 rotate-45 shrink-0 opacity-70" style={{ backgroundColor: currentColors.divider }} />
          <div className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ backgroundColor: currentColors.divider }} />
          <div className="w-1 h-1 rotate-45 shrink-0 opacity-70" style={{ backgroundColor: currentColors.divider }} />
          <div className="h-[0.5px] flex-1" style={{ backgroundColor: currentColors.divider }} />
        </div>
      )}

      {/* Typography Brand Mark (NaxtTo) */}
      {layout !== 'icon-only' && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center' : 'items-start'} leading-none`}>
          <span className={`font-serif font-normal ${currentSize.title} ${currentColors.text} tracking-[0.24em]`}>
            NaxtTo
          </span>
          {showSubtitle && (
            <span className={`font-sans uppercase font-light mt-1 ${currentSize.subtitle} ${currentColors.subtitle}`}>
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return content;
};

