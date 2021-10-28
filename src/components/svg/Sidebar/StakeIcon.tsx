import React, { useContext } from 'react';

import { ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';

export const StakeIcon: React.FC<IconProps> = ({
  id,
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5 14L13 3V10H18L10 21V14H5Z" stroke={`url(#StakeIcon-${id}paint0_linear)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id={`StakeIcon-${id}paint0_linear`} x1="5" y1="3" x2="19.6767" y2="4.49061" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>

  );
};
