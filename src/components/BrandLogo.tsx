import React from 'react';

export interface BrandLogoProps {
  layout?: 'vertical' | 'horizontal' | 'icon-only' | 'text-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  variant?: 'dark' | 'light' | 'gold' | 'champagne' | 'monochrome' | 'inherit';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  onClick?: () => void;
  id?: string;
}

/**
 * Geometric Lotus Emblem from NaxtTo Brand Identity
 */
export const LotusEmblem: React.FC<{
  className?: string;
  sizeClass?: string;
  strokeWidth?: number;
  color?: string;
}> = ({ 
  className = "w-8 h-8", 
  sizeClass, 
  strokeWidth = 2.4,
  color = "currentColor" 
}) => {
  return (
    <svg
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass || className} shrink-0 transition-transform duration-300`}
      aria-label="NaxtTo Lotus Emblem"
    >
      {/* Outer Bottom Base Arc */}
      <path
        d="M 17 48 C 17 72, 36 84, 50 84 C 64 84, 83 72, 83 48"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outermost Wings (Left & Right) */}
      <path
        d="M 17 48 C 19 36, 30 30, 39 36 C 45 42, 48 58, 50 82"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 83 48 C 81 36, 70 30, 61 36 C 55 42, 52 58, 50 82"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Mid-Outer Petals (Left & Right) */}
      <path
        d="M 28 36 C 30 22, 44 18, 50 30 C 50 48, 48 66, 50 82"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 72 36 C 70 22, 56 18, 50 30 C 50 48, 52 66, 50 82"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Petal Arcs (Center-flanking) */}
      <path
        d="M 39 36 C 38 18, 48 10, 50 10 C 52 10, 62 18, 61 36"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Heart/Bud Petal */}
      <path
        d="M 50 10 C 44 26, 44 54, 50 78 C 56 54, 56 26, 50 10 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Base Cradle Lines */}
      <path
        d="M 28 36 C 32 54, 40 74, 50 82 C 60 74, 68 54, 72 36"
        stroke={color}
        strokeWidth={strokeWidth}
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
      icon: '#1d1d1f',
      text: 'text-[#1d1d1f]',
      subtitle: 'text-[#86868b]'
    },
    light: {
      icon: '#fdfcfb',
      text: 'text-[#fdfcfb]',
      subtitle: 'text-[#a39d96]'
    },
    gold: {
      icon: '#c5a059',
      text: 'text-[#1d1d1f]',
      subtitle: 'text-[#c5a059]'
    },
    champagne: {
      icon: '#d4af37',
      text: 'text-[#d4af37]',
      subtitle: 'text-[#d4af37]/80'
    },
    monochrome: {
      icon: 'currentColor',
      text: 'text-current',
      subtitle: 'text-current opacity-70'
    },
    inherit: {
      icon: 'currentColor',
      text: 'text-current',
      subtitle: 'text-current opacity-70'
    }
  };

  const currentColors = colorMap[variant] || colorMap.dark;

  // Size configurations
  const sizeConfig = {
    xs: {
      icon: 'w-4 h-4',
      title: 'text-sm tracking-[0.18em]',
      subtitle: 'text-[8px] tracking-[0.2em]',
      gap: 'gap-1.5'
    },
    sm: {
      icon: 'w-6 h-6',
      title: 'text-base sm:text-lg tracking-[0.2em]',
      subtitle: 'text-[9px] tracking-[0.22em]',
      gap: 'gap-2'
    },
    md: {
      icon: 'w-8 h-8',
      title: 'text-xl sm:text-2xl tracking-[0.22em]',
      subtitle: 'text-[10px] sm:text-[11px] tracking-[0.25em]',
      gap: 'gap-2.5'
    },
    lg: {
      icon: 'w-10 h-10',
      title: 'text-2xl sm:text-3xl tracking-[0.25em]',
      subtitle: 'text-xs tracking-[0.28em]',
      gap: 'gap-3'
    },
    xl: {
      icon: 'w-14 h-14',
      title: 'text-3xl sm:text-4xl tracking-[0.3em]',
      subtitle: 'text-xs sm:text-sm tracking-[0.3em]',
      gap: 'gap-3.5'
    },
    '2xl': {
      icon: 'w-20 h-20',
      title: 'text-4xl sm:text-5xl tracking-[0.32em]',
      subtitle: 'text-sm tracking-[0.35em]',
      gap: 'gap-4'
    },
    custom: {
      icon: 'w-8 h-8',
      title: 'text-xl tracking-[0.22em]',
      subtitle: 'text-[10px] tracking-[0.25em]',
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

      {/* Typography Brand Mark */}
      {layout !== 'icon-only' && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center' : 'items-start'} leading-none`}>
          <span className={`font-serif font-normal uppercase ${currentSize.title} ${currentColors.text} tracking-[0.28em]`}>
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
