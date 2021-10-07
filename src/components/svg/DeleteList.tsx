import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const DeleteList: React.FC<IconProps> = ({
  className,
  id = '',
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z" fill={`url(#DeleteList-${id}-paint0_linear)`} />
      <linearGradient id={`DeleteList-${id}-paint0_linear`} x1="4" y1="4" x2="21.8961" y2="6.51664" gradientUnits="userSpaceOnUse">
        <stop stopColor={themeColors.fill1} />
        <stop offset="1" stopColor={themeColors.fill2} />
      </linearGradient>
    </svg>
  );
};
