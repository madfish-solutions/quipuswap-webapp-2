import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const APY: React.FC<IconProps> = ({ className }) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
        fill="url(#paint0_linear)"
      />
      <path d="M11.25 7.71997H6.25V9.21997H11.25V7.71997Z" fill="url(#paint1_linear)" />
      <path d="M18 15.75H13V17.25H18V15.75Z" fill="url(#paint2_linear)" />
      <path d="M18 13.25H13V14.75H18V13.25Z" fill="url(#paint3_linear)" />
      <path d="M8 18H9.5V16H11.5V14.5H9.5V12.5H8V14.5H6V16H8V18Z" fill="url(#paint4_linear)" />
      <path
        d="M14.09 10.95L15.5 9.54L16.91 10.95L17.97 9.89L16.56 8.47L17.97 7.06L16.91 6L15.5 7.41L14.09 6L13.03 7.06L14.44 8.47L13.03 9.89L14.09 10.95Z"
        fill="url(#paint5_linear)"
      />
      <defs>
        <linearGradient id="paint0_linear" x1="3" y1="3" x2="23.1331" y2="5.83122" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="6.25"
          y1="7.71997"
          x2="10.9257"
          y2="9.91172"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="paint2_linear" x1="13" y1="15.75" x2="17.6757" y2="17.9418" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="paint3_linear" x1="13" y1="13.25" x2="17.6757" y2="15.4418" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="paint4_linear" x1="6" y1="12.5" x2="12.1518" y2="13.3651" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="paint5_linear" x1="13.03" y1="6" x2="18.5559" y2="6.7755" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
