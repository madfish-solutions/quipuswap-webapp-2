import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';

export const LiquidityIcon: FC<IconProps> = ({ id, className }) => {
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
        d="M9.99983 11.7112L5.74028 17.6234C5.02544 18.6156 5.73444 20.0002 6.95731 20.0002H17.0964C18.3196 20.0002 19.0285 18.6148 18.3129 17.6227L13.9998 11.6432V6.97224L9.99983 5.58989V11.7112Z"
        stroke={`url(#LiquidityIcon-${id}paint0_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13.5H12"
        stroke={`url(#LiquidityIcon-${id}paint1_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 16.5H17.25"
        stroke={`url(#LiquidityIcon-${id}paint2_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={`LiquidityIcon-${id}paint0_linear`}
          x1="4.02783"
          y1="20.0002"
          x2="21.8435"
          y2="17.2185"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`LiquidityIcon-${id}paint1_linear`}
          x1="9"
          y1="13.5"
          x2="11.9049"
          y2="14.7255"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`LiquidityIcon-${id}paint2_linear`}
          x1="15"
          y1="16.5"
          x2="17.3329"
          y2="17.2381"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
