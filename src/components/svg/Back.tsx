import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const Back: React.FC<IconProps> = ({
  className,
  id = '',
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill={`url(#Back-${id}-paint0_linear)`} />
      <defs>
        <linearGradient id={`Back-${id}-paint0_linear`} x1="4" y1="4" x2="21.8961" y2="6.51664" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
