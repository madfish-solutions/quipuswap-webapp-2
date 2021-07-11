import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const LiquidityIcon: React.FC<IconProps> = ({
  className,
  active,
}) => {
  const { themeColors, inactiveIconColor } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.99995 11.7112L5.7404 17.6234C5.02557 18.6156 5.73457 20.0002 6.95743 20.0002H17.0965C18.3197 20.0002 19.0286 18.6148 18.313 17.6227L14 11.6432V6.97224L9.99995 5.58989V11.7112Z"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13.5H12"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 16.5H17.25"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
