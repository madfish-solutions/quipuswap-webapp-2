import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const SwapIcon: React.FC<IconProps> = ({
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M11 14.01V7H9V14.01H6L10 18L14 14.01H11ZM4 0L0 3.99H3V11H5V3.99H8L4 0ZM11 14.01V7H9V14.01H6L10 18L14 14.01H11ZM4 0L0 3.99H3V11H5V3.99H8L4 0Z" fill="url(#paint0_linear)" />
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="15.78" y2="1.72593" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>

  );
};
