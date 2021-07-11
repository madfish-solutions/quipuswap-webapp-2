import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const SwapIcon: React.FC<IconProps> = ({
  className,
  active,
}) => {
  const { themeColors, inactiveIconColor } = useContext(ColorThemeContext);
  return (
    <svg width="24" height="24" className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3.99976L19 6.99976L16 9.99976" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.99994 6.99976H17.9999" stroke="url(#paint1_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.99994 20.0002L3.99994 17.0002L6.99994 14.0002" stroke="url(#paint2_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 17.0002H5" stroke="url(#paint3_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="paint0_linear" x1="16" y1="3.99976" x2="19.405" y2="4.23917" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? themeColors.fill1 : inactiveIconColor} />
          <stop offset="1" stopColor={active ? themeColors.fill2 : inactiveIconColor} />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="3.99994" y1="6.99976" x2="7.27492" y2="13.4474" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? themeColors.fill1 : inactiveIconColor} />
          <stop offset="1" stopColor={active ? themeColors.fill2 : inactiveIconColor} />
        </linearGradient>
        <linearGradient id="paint2_linear" x1="3.99994" y1="14.0002" x2="7.40498" y2="14.2397" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? themeColors.fill1 : inactiveIconColor} />
          <stop offset="1" stopColor={active ? themeColors.fill2 : inactiveIconColor} />
        </linearGradient>
        <linearGradient id="paint3_linear" x1="5" y1="17.0002" x2="8.27498" y2="23.4479" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? themeColors.fill1 : inactiveIconColor} />
          <stop offset="1" stopColor={active ? themeColors.fill2 : inactiveIconColor} />
        </linearGradient>
      </defs>
    </svg>

  );
};
