import React, { useContext } from 'react';

import { ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';

export const CheckMark: React.FC<IconProps> = ({
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="url(#CheckMark-paint0_linear)" />
      <path d="M14.59 5.58008L8 12.1701L5.41 9.59008L4 11.0001L8 15.0001L16 7.00008L14.59 5.58008Z" fill="url(#CheckMark-paint1_linear)" />
      <defs>
        <linearGradient id="CheckMark-paint0_linear" x1="0" y1="0" x2="22.3701" y2="3.1458" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="CheckMark-paint1_linear" x1="4" y1="5.58008" x2="17.2619" y2="7.95582" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
