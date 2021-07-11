import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const PortfolioIcon: React.FC<IconProps> = ({
  className,
  active,
}) => {
  const { themeColors, inactiveIconColor } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0001 22.0002C17.5229 22.0002 22.0001 17.523 22.0001 12.0002C22.0001 6.47739 17.5229 2.00024 12.0001 2.00024C6.47721 2.00024 2.00006 6.47739 2.00006 12.0002C2.00006 17.523 6.47721 22.0002 12.0001 22.0002Z"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.0002H22M12 2.00024V12.0002V2.00024ZM12 22.0002V12.0002V22.0002Z"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
