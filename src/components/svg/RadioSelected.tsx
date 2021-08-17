import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const RadioSelected: React.FC<IconProps> = ({
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="url(#RadioSelected0_linear)" />
      <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="url(#RadioSelected-paint1_linear)" />
      <defs>
        <linearGradient id="RadioSelected0_linear" x1="2" y1="2" x2="24.3701" y2="5.1458" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="RadioSelected-paint1_linear" x1="7" y1="7" x2="18.1851" y2="8.5729" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
