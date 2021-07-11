import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const StakeIcon: React.FC<IconProps> = ({
  className,
  active,
}) => {
  const { themeColors, inactiveIconColor } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 14L13 3V10H18L10 21V14H5Z" stroke={active ? themeColors.fill1 : inactiveIconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
