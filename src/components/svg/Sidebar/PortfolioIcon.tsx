import React, { useContext } from 'react';

import { ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';

export const PortfolioIcon: React.FC<IconProps> = ({
  id,
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 22.0002C17.5228 22.0002 22 17.523 22 12.0002C22 6.47739 17.5228 2.00024 12 2.00024C6.47715 2.00024 2 6.47739 2 12.0002C2 17.523 6.47715 22.0002 12 22.0002Z" stroke={`url(#PortfolioIcon-${id}paint0_linear)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12.0002H22M12 2.00024V12.0002V2.00024ZM12 22.0002V12.0002V22.0002Z" stroke={`url(#PortfolioIcon-${id}paint1_linear)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id={`PortfolioIcon-${id}paint0_linear`} x1="2" y1="2.00024" x2="24.3701" y2="5.14604" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={`PortfolioIcon-${id}paint1_linear`} x1="12" y1="2.00024" x2="23.3501" y2="2.7983" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>

  );
};
