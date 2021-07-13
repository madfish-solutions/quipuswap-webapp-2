import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const PopupClose: React.FC<IconProps> = ({
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (

    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="url(#PopupClose-paint0_linear)" />
      <defs>
        <linearGradient id="PopupClose-paint0_linear" x1="5" y1="5" x2="20.6591" y2="7.20206" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill2} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>

  );
};
