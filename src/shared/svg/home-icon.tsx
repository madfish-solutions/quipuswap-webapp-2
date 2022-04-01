import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const HomeIcon: FC<IconProps> = ({ id, className }) => {
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
        d="M3 10.1822V22.0002H21V10.1822L12 2.00024L3 10.1822Z"
        stroke={`url(#HomeIcon-${id}paint0_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 14.0002H9V22.0002H15V14.0002Z"
        stroke={`url(#HomeIcon-${id}paint1_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={`HomeIcon-${id}paint0_linear`}
          x1="3"
          y1="2.00024"
          x2="23.2076"
          y2="4.55776"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`HomeIcon-${id}paint1_linear`}
          x1="9"
          y1="14.0002"
          x2="15.7685"
          y2="14.7141"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
