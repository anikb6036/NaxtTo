import React from 'react';
import userBrandLogo from '../assets/images/user_brand_logo.svg';

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
  usePhotoEmblem?: boolean;
}

/**
 * Vibrant Brand Logo Emblem provided by User
 */
export const UserBrandLogoEmblem: React.FC<{
  className?: string;
  sizeClass?: string;
  color?: string;
  strokeWidth?: number;
  embossed?: boolean;
  alt?: string;
}> = ({ 
  className = "w-8 h-auto", 
  sizeClass, 
  alt = "Brand Logo"
}) => {
  return (
    <img
      src={userBrandLogo}
      alt={alt}
      className={`${sizeClass || className} object-contain shrink-0 transition-transform duration-200 select-none`}
      referrerPolicy="no-referrer"
    />
  );
};

// Aliases for backwards compatibility
export const MyntraEmblem = UserBrandLogoEmblem;
export const LotusEmblem = UserBrandLogoEmblem;

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
      icon: '#F50087',
      text: 'text-[#282c3f]',
      subtitle: 'text-[#696e79]',
      divider: '#F50087',
      embossed: false
    },
    dark: {
      icon: '#F50087',
      text: 'text-[#282c3f]',
      subtitle: 'text-[#696e79]',
      divider: '#F50087',
      embossed: false
    },
    embossed: {
      icon: '#F50087',
      text: 'text-[#282c3f]',
      subtitle: 'text-[#696e79]',
      divider: '#F50087',
      embossed: false
    },
    light: {
      icon: '#FFFFFF',
      text: 'text-white',
      subtitle: 'text-gray-300',
      divider: '#F50087',
      embossed: false
    },
    gold: {
      icon: '#F50087',
      text: 'text-[#282c3f]',
      subtitle: 'text-[#F50087]',
      divider: '#F50087',
      embossed: false
    },
    champagne: {
      icon: '#F50087',
      text: 'text-[#282c3f]',
      subtitle: 'text-[#F50087]',
      divider: '#F50087',
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
      icon: 'h-5 w-auto',
      title: 'text-sm sm:text-base tracking-tight font-extrabold',
      subtitle: 'text-[8px] tracking-[0.2em] font-bold',
      dividerWidth: 'max-w-[80px]',
      gap: 'gap-2'
    },
    sm: {
      icon: 'h-6 sm:h-7 w-auto',
      title: 'text-base sm:text-lg tracking-tight font-extrabold',
      subtitle: 'text-[8.5px] tracking-[0.22em] font-bold',
      dividerWidth: 'max-w-[100px]',
      gap: 'gap-2 sm:gap-2.5'
    },
    md: {
      icon: 'h-8 sm:h-9 w-auto',
      title: 'text-xl sm:text-2xl tracking-tight font-extrabold',
      subtitle: 'text-[9.5px] tracking-[0.25em] font-bold',
      dividerWidth: 'max-w-[130px]',
      gap: 'gap-2.5 sm:gap-3'
    },
    lg: {
      icon: 'h-10 sm:h-12 w-auto',
      title: 'text-2xl sm:text-3xl tracking-tight font-extrabold',
      subtitle: 'text-xs tracking-[0.26em] font-bold',
      dividerWidth: 'max-w-[160px]',
      gap: 'gap-3.5'
    },
    xl: {
      icon: 'h-14 sm:h-16 w-auto',
      title: 'text-3xl sm:text-4xl tracking-tight font-extrabold',
      subtitle: 'text-xs sm:text-sm tracking-[0.28em] font-bold',
      dividerWidth: 'max-w-[200px]',
      gap: 'gap-4'
    },
    '2xl': {
      icon: 'h-20 sm:h-24 w-auto',
      title: 'text-4xl sm:text-5xl tracking-tight font-extrabold',
      subtitle: 'text-sm sm:text-base tracking-[0.3em] font-bold',
      dividerWidth: 'max-w-[240px]',
      gap: 'gap-4.5'
    },
    original: {
      icon: 'h-24 sm:h-28 w-auto',
      title: 'text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold',
      subtitle: 'text-xs sm:text-sm tracking-[0.32em] font-bold',
      dividerWidth: 'max-w-[280px]',
      gap: 'gap-4'
    },
    custom: {
      icon: 'h-7 sm:h-8 w-auto',
      title: 'text-lg tracking-tight font-extrabold',
      subtitle: 'text-[9px] tracking-[0.22em] font-bold',
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
      {/* Official Myntra Logo Icon */}
      {(showIcon || layout === 'icon-only') && (
        <MyntraEmblem
          className={`${currentSize.icon} group-hover:scale-105 transition-transform duration-200`}
        />
      )}

      {/* Decorative Accent Rule for vertical layout */}
      {layout === 'vertical' && (
        <NaxtToDivider 
          color={currentColors.divider} 
          width={currentSize.dividerWidth}
        />
      )}

      {/* Typography Brand Mark (NaxtTo with vibrant Myntra accent) */}
      {layout !== 'icon-only' && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center' : 'items-start'} justify-center leading-none`}>
          <span 
            className={`font-sans tracking-tight ${currentSize.title} ${currentColors.text}`}
          >
            Naxt<span className="bg-gradient-to-r from-[#F50087] via-[#F0501A] to-[#FFA033] bg-clip-text text-transparent">To</span>
          </span>
          {showSubtitle && (
            <span 
              className={`font-sans uppercase font-bold mt-1 ${currentSize.subtitle} ${currentColors.subtitle}`}
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


