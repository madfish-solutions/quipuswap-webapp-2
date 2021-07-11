import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const HomeIcon: React.FC<IconProps> = ({
  className,
  active,
}) => {
  const { themeColors, inactiveIconColor } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10.1822V22.0002H21V10.1822L12 2.00024L3 10.1822Z" stroke={active ? themeColors.fill2 : inactiveIconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 14.0002H9V22.0002H15V14.0002Z" stroke={active ? themeColors.fill2 : inactiveIconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
