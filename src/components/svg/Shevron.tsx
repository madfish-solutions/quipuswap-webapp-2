import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const Shevron: React.FC<IconProps> = ({ className }) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M3 6L8 11L13 6H3Z" fill="url(#Shevron-paint0_linear)" />
      <defs>
        <linearGradient
          id="Shevron-paint0_linear"
          x1="3"
          y1="6"
          x2="13.5701"
          y2="8.97285"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
