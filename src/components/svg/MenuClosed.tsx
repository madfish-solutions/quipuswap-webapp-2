import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const MenuClosed: React.FC<IconProps> = ({
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect
        x="0.25"
        y="3.75"
        width="3.5"
        height="23.5"
        rx="1.75"
        transform="rotate(-90 0.25 3.75)"
        fill="url(#MenuClosed-paint0_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <rect
        x="0.25"
        y="13.75"
        width="3.5"
        height="16.5"
        rx="1.75"
        transform="rotate(-90 0.25 13.75)"
        fill="url(#MenuClosed-paint1_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <path
        d="M12 7.25C14.6234 7.25 16.75 9.37665 16.75 12C16.75 14.6234 14.6234 16.75 12 16.75C9.37665 16.75 7.25 14.6234 7.25 12C7.25 9.37665 9.37665 7.25 12 7.25Z"
        fill="url(#MenuClosed-paint2_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <rect
        x="13.25"
        y="13.75"
        width="3.5"
        height="10.5"
        rx="1.75"
        transform="rotate(-90 13.25 13.75)"
        fill="url(#MenuClosed-paint3_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <path
        d="M10.7626 13.237L10.7626 13.2369C10.0791 12.5535 10.0791 11.4455 10.7626 10.7621C11.446 10.0787 12.554 10.0787 13.2374 10.7621L16.2375 13.7625L16.2375 13.7626C16.9209 14.446 16.9209 15.554 16.2375 16.2374C15.5541 16.9208 14.446 16.9209 13.7626 16.2375C13.7626 16.2374 13.7626 16.2374 13.7626 16.2374L10.7626 13.237Z"
        fill="url(#MenuClosed-paint4_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <rect
        x="0.25"
        y="23.75"
        width="3.5"
        height="23.5"
        rx="1.75"
        transform="rotate(-90 0.25 23.75)"
        fill="url(#MenuClosed-paint5_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient
          id="MenuClosed-paint0_linear"
          x1="0"
          y1="4"
          x2="4.56"
          y2="4.10687"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="MenuClosed-paint1_linear"
          x1="0"
          y1="14"
          x2="4.55751"
          y2="14.1508"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="MenuClosed-paint2_linear"
          x1="7"
          y1="17"
          x2="8.5729"
          y2="5.81494"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="MenuClosed-paint3_linear"
          x1="13"
          y1="14"
          x2="17.5506"
          y2="14.2327"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="MenuClosed-paint4_linear"
          x1="10"
          y1="17"
          x2="11.1012"
          y2="9.16993"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="MenuClosed-paint5_linear"
          x1="0"
          y1="24"
          x2="4.56"
          y2="24.1069"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
