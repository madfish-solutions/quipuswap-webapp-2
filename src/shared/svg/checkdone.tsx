import { useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const Checkdone: React.FC<IconProps> = ({ className }) => {
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
        fill="url(#Checkdone-paint0_linear)"
      />
      <path
        d="M17.9902 9.00008L16.5802 7.58008L9.99023 14.1701L7.41023 11.6001L5.99023 13.0101L9.99023 17.0001L17.9902 9.00008Z"
        fill="url(#Checkdone-paint1_linear)"
      />
      <defs>
        <linearGradient
          id="Checkdone-paint0_linear"
          x1="3"
          y1="3"
          x2="23.1331"
          y2="5.83122"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="Checkdone-paint1_linear"
          x1="5.99023"
          y1="7.58008"
          x2="19.2521"
          y2="9.95582"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
