import React, { useId } from 'react';

export interface StarRatingProps {
  /** Numeric rating (e.g., 4.8, 4.0, 5) */
  rating: number;
  /** Optional review count (e.g. 346) */
  count?: number;
  /** Whether to show the count number */
  showCount?: boolean;
  /** Format for count: 'number' (346) or 'parentheses' ((346)) */
  countFormat?: 'number' | 'parentheses';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Additional wrapper class */
  className?: string;
  /** Additional count text class */
  countClassName?: string;
  /** Custom star color (defaults to vibrant Amazon-style orange #FF6000) */
  starColor?: string;
  /** Custom count color (defaults to link blue #007185) */
  countColor?: string;
  /** Interactive mode (e.g., in review submission form) */
  interactive?: boolean;
  /** Callback for interactive rating changes */
  onRatingChange?: (rating: number) => void;
}

/**
 * Single 5-point star matching the exact sharp, vibrant orange design from user reference
 */
export const OrangeStar: React.FC<{
  fillPercent?: number; // 0 to 100
  sizeClass?: string;
  color?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
}> = ({
  fillPercent = 100,
  sizeClass = 'w-3.5 h-3.5',
  color = '#FF6000',
  className = '',
  onClick,
  onMouseEnter
}) => {
  const gradientId = useId();

  const isFull = fillPercent >= 99;
  const isEmpty = fillPercent <= 1;

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${sizeClass} ${className} shrink-0 inline-block align-middle`}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{ cursor: onClick ? 'pointer' : 'inherit' }}
    >
      {!isFull && !isEmpty && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${fillPercent}%`} stopColor={color} />
            <stop offset={`${fillPercent}%`} stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={
          isFull
            ? color
            : isEmpty
            ? 'transparent'
            : `url(#${gradientId})`
        }
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

/**
 * Universal 5-Star Rating Component matching the requested design:
 * - 5 sharp stars in vibrant orange (#FF6000)
 * - Solid filled stars for rating, hollow crisp outline for empty stars
 * - Review count displayed in distinctive blue (#007185 / #0066C0) right beside stars
 */
export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  count,
  showCount = true,
  countFormat = 'number',
  size = 'sm',
  className = '',
  countClassName = '',
  starColor = '#FF6000',
  countColor = 'text-[#007185]',
  interactive = false,
  onRatingChange
}) => {
  // Size presets
  const sizeMap = {
    xs: {
      star: 'w-2.5 h-2.5 sm:w-3 sm:h-3',
      gap: 'gap-0.5',
      text: 'text-[10px] sm:text-[11px] ml-1'
    },
    sm: {
      star: 'w-3.5 h-3.5',
      gap: 'gap-0.5',
      text: 'text-xs ml-1.5'
    },
    md: {
      star: 'w-4 h-4 sm:w-4.5 sm:h-4.5',
      gap: 'gap-1',
      text: 'text-sm ml-2'
    },
    lg: {
      star: 'w-5 h-5 sm:w-6 sm:h-6',
      gap: 'gap-1',
      text: 'text-base ml-2.5'
    },
    xl: {
      star: 'w-6 h-6 sm:w-7 sm:h-7',
      gap: 'gap-1.5',
      text: 'text-lg ml-3'
    }
  };

  const currentSize = sizeMap[size];

  // Calculate percentage fill for each of the 5 stars
  const stars = [0, 1, 2, 3, 4].map((index) => {
    const fillDiff = rating - index;
    if (fillDiff >= 1) return 100;
    if (fillDiff <= 0) return 0;
    return Math.round(fillDiff * 100);
  });

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* 5 Stars Row */}
      <div className={`inline-flex items-center ${currentSize.gap}`}>
        {stars.map((fillPercent, index) => (
          <OrangeStar
            key={index}
            fillPercent={fillPercent}
            sizeClass={currentSize.star}
            color={starColor}
            onClick={interactive && onRatingChange ? () => onRatingChange(index + 1) : undefined}
          />
        ))}
      </div>

      {/* Blue Review Count */}
      {showCount && count !== undefined && (
        <span
          className={`font-sans font-normal leading-none ${currentSize.text} ${countColor} ${countClassName}`}
        >
          {countFormat === 'parentheses' ? `(${count})` : count}
        </span>
      )}
    </div>
  );
};

export default StarRating;
