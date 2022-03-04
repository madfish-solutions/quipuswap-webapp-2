import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const ArrowDown: React.FC<IconProps> = ({ className }) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20 12L18.59 10.59L13 16.17V4H11V16.17L5.42 10.58L4 12L12 20L20 12Z"
        fill="url(#ArrowDown-paint0_linear)"
      />
      <defs>
        <linearGradient
          id="ArrowDown-paint0_linear"
          x1="4"
          y1="4"
          x2="21.8961"
          y2="6.51664"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
