import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const WarnList: React.FC<IconProps> = ({
  className,
  id = '',
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M13 17H11V15L13 15V17ZM13 13H11V7H13V13ZM12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22ZM12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4Z" fill={`url(#WarnList-${id}-paint0_linear)`} />
      <linearGradient id={`WarnList-${id}-paint0_linear`} x1="4" y1="4" x2="21.8961" y2="6.51664" gradientUnits="userSpaceOnUse">
        <stop stopColor={themeColors.fill1} />
        <stop offset="1" stopColor={themeColors.fill2} />
      </linearGradient>
    </svg>
  );
};
