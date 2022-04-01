import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const MenuOpened: FC<IconProps> = ({ className }) => {
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
      <rect
        y="0.35386"
        width="3.48964"
        height="23.4585"
        rx="1.74482"
        transform="matrix(0.706494 0.707719 -0.706494 0.707719 19.1987 2.16483)"
        fill="url(#MenuOpened-paint0_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <rect
        x="0.353247"
        width="3.48964"
        height="16.4682"
        rx="1.74482"
        transform="matrix(0.706494 -0.707719 0.706494 0.707719 2.23186 5.1853)"
        fill="url(#MenuOpened-paint1_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <path
        d="M15.3463 8.64736C17.1962 10.5004 17.1971 13.5035 15.3489 15.3549C13.5007 17.2063 10.5028 17.2054 8.65293 15.3524C6.80308 13.4993 6.80217 10.4962 8.65038 8.64481C10.4986 6.7934 13.4965 6.7943 15.3463 8.64736Z"
        fill="url(#MenuOpened-paint2_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <rect
        x="0.353247"
        y="-2.23517e-07"
        width="3.48964"
        height="10.4794"
        rx="1.74482"
        transform="matrix(0.706493 -0.70772 0.706494 0.707719 11.3996 14.3682)"
        fill="url(#MenuOpened-paint3_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <path
        d="M10.2569 11.9989L10.2569 11.9989C10.2565 11.0341 11.037 10.2523 12.0001 10.2527C12.9634 10.253 13.7446 11.0356 13.7449 12.0005C13.7449 12.0005 13.7449 12.0005 13.7449 12.0005L13.7461 16.2377L13.7461 16.2377C13.7465 17.2025 12.966 17.9843 12.0029 17.984C11.0397 17.9836 10.2584 17.2011 10.2581 16.2361C10.2581 16.2361 10.2581 16.2361 10.2581 16.2361L10.2569 11.9989Z"
        fill="url(#MenuOpened-paint4_linear)"
        stroke={themeColors.stroke}
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient
          id="MenuOpened-paint0_linear"
          x1="0"
          y1="0"
          x2="4.54818"
          y2="0.106506"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="MenuOpened-paint1_linear"
          x1="0"
          y1="0"
          x2="4.54571"
          y2="0.150301"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="MenuOpened-paint2_linear"
          x1="4.95044"
          y1="11.9973"
          x2="13.9512"
          y2="5.22623"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="MenuOpened-paint3_linear"
          x1="0"
          y1="0"
          x2="4.53883"
          y2="0.231932"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="MenuOpened-paint4_linear"
          x1="7.0669"
          y1="14.1167"
          x2="13.3679"
          y2="9.37667"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
