import React from 'react';
import robotLogoImg from '../assets/images/chatbot_logo_1790427393177.jpg';

interface ChatbotRobotIconProps {
  className?: string;
  size?: number | string;
  useImage?: boolean;
}

export const ChatbotRobotIcon: React.FC<ChatbotRobotIconProps> = ({
  className = "w-4 h-4",
  useImage = false
}) => {
  if (useImage) {
    return (
      <img
        src={robotLogoImg}
        alt="Chatbot Robot Assistant"
        className={`${className} object-contain rounded-full`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Chatbot Robot Logo"
    >
      <defs>
        {/* Glow & Gradients matching Robot-featured.png */}
        <linearGradient id="robotBodyGrad" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.75" stopColor="#EAEFF5" />
          <stop offset="1" stopColor="#D4DFEB" />
        </linearGradient>

        <linearGradient id="robotVisorGrad" x1="25" y1="26" x2="75" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E2433" />
          <stop offset="1" stopColor="#111622" />
        </linearGradient>

        <linearGradient id="robotEarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#506176" />
          <stop offset="1" stopColor="#2D3B4D" />
        </linearGradient>

        <linearGradient id="eyePurpleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#7E22CE" />
        </linearGradient>

        <linearGradient id="tabletGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>

        <linearGradient id="bubbleYellowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#FACC15" />
        </linearGradient>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Floating Yellow Chat Bubble Top Right */}
      <g transform="translate(68, 6) scale(0.24)">
        <rect x="0" y="0" width="56" height="38" rx="8" fill="url(#bubbleYellowGrad)" />
        <path d="M 12 38 L 8 46 L 22 38 Z" fill="#FACC15" />
        <circle cx="16" cy="19" r="6" stroke="#9A6B00" strokeWidth="3" fill="none" opacity="0.8" />
        <line x1="26" y1="19" x2="44" y2="19" stroke="#9A6B00" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Floating Yellow Chat Bubble Left */}
      <g transform="translate(2, 40) scale(0.22)">
        <rect x="0" y="0" width="52" height="36" rx="8" fill="url(#bubbleYellowGrad)" />
        <path d="M 40 36 L 46 44 L 32 36 Z" fill="#FACC15" />
        <line x1="12" y1="18" x2="40" y2="18" stroke="#9A6B00" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Robot Body / Torso */}
      <path
        d="M 28 62 C 28 54 72 54 72 62 C 75 75 70 88 50 88 C 30 88 25 75 28 62 Z"
        fill="url(#robotBodyGrad)"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />

      {/* Arms / Shoulders with slate blue accents */}
      <ellipse cx="27" cy="67" rx="6" ry="9" fill="#3B4858" transform="rotate(-15 27 67)" />
      <ellipse cx="73" cy="67" rx="6" ry="9" fill="#3B4858" transform="rotate(15 73 67)" />
      <path d="M 27 67 C 28 76 34 83 41 83" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 73 67 C 71 76 63 85 53 85" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Chest Display Screen */}
      <rect x="37" y="64" width="26" height="11" rx="5.5" fill="#1E2433" />
      {/* 4 Colored Indicator Dots */}
      <circle cx="43" cy="69.5" r="1.6" fill="#F59E0B" />
      <circle cx="48" cy="69.5" r="1.6" fill="#FBBF24" />
      <circle cx="53" cy="69.5" r="1.6" fill="#FFFFFF" />
      <circle cx="58" cy="69.5" r="1.6" fill="#EC4899" />

      {/* Hand Tablet */}
      <g transform="translate(35, 74) rotate(-12)">
        <rect x="0" y="0" width="18" height="13" rx="2" fill="url(#tabletGrad)" />
        <circle cx="15.5" cy="2" r="1" fill="#FFFFFF" opacity="0.8" />
      </g>

      {/* Side Ear Muff / Speakers */}
      <ellipse cx="23" cy="38" rx="5" ry="9" fill="url(#robotEarGrad)" />
      <ellipse cx="23" cy="38" rx="2.5" ry="5.5" fill="#1E2433" />
      <path d="M 23 35 L 23 41" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />

      <ellipse cx="77" cy="38" rx="5" ry="9" fill="url(#robotEarGrad)" />
      <ellipse cx="77" cy="38" rx="2.5" ry="5.5" fill="#1E2433" />
      <path d="M 77 35 L 77 41" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />

      {/* Head Outer Shell */}
      <path
        d="M 50 12 C 30 12 24 23 24 38 C 24 53 32 58 50 58 C 68 58 76 53 76 38 C 76 23 70 12 50 12 Z"
        fill="url(#robotBodyGrad)"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />

      {/* Head Highlight */}
      <ellipse cx="50" cy="16" rx="14" ry="3" fill="#FFFFFF" opacity="0.7" />

      {/* Black Face Visor Screen */}
      <path
        d="M 50 25 C 33 25 30 30 30 38 C 30 46 34 50 50 50 C 66 50 70 46 70 38 C 70 30 67 25 50 25 Z"
        fill="url(#robotVisorGrad)"
      />

      {/* Visor Glare / Reflection */}
      <path
        d="M 33 32 C 38 27 60 27 67 32 C 63 29 45 28 33 32 Z"
        fill="#FFFFFF"
        opacity="0.25"
      />

      {/* Purple Glowing Eyes */}
      <circle cx="41" cy="38" r="4.2" fill="url(#eyePurpleGrad)" filter="url(#softGlow)" />
      <circle cx="42" cy="37" r="1.3" fill="#FFFFFF" />

      <circle cx="59" cy="38" r="4.2" fill="url(#eyePurpleGrad)" filter="url(#softGlow)" />
      <circle cx="60" cy="37" r="1.3" fill="#FFFFFF" />

      {/* Friendly Smile Curved Line */}
      <path
        d="M 46 43 Q 50 46.5 54 43"
        stroke="#E2E8F0"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
export default ChatbotRobotIcon;
