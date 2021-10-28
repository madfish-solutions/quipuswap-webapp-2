import React, { useContext } from 'react';

import { ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';

export const Plus: React.FC<IconProps> = ({
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="url(#Plus-paint0_linear)" />
      <defs>
        <linearGradient id="Plus-paint0_linear" x1="5" y1="5" x2="20.6591" y2="7.20206" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>

  );
};
