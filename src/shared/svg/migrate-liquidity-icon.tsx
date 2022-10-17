import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const MigrateLiquidityIcon: FC<IconProps> = ({ className }) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg
      className={className}
      width={56}
      height={50}
      fill="none"
      viewBox="0 0 56 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M51.067 42.914 29.407 5.008c-.768-1.344-2.706-1.344-3.474 0L4.273 42.914c-.763 1.334.2 2.993 1.736 2.993H49.33c1.535 0 2.498-1.66 1.736-2.993ZM32.88 3.024c-2.303-4.032-8.115-4.032-10.419 0L.8 40.93c-2.286 4 .602 8.977 5.209 8.977H49.33c4.607 0 7.495-4.977 5.21-8.977L32.878 3.023Z"
        fill="url(#a)"
      />
      <path
        d="m29.92 16.907-.443 16.295h-4.16l-.454-16.295h5.057Zm-2.523 23.568c-.75 0-1.394-.265-1.931-.796a2.596 2.596 0 0 1-.796-1.931c-.008-.743.258-1.38.795-1.91a2.655 2.655 0 0 1 1.932-.795c.72 0 1.353.265 1.898.796.545.53.822 1.166.83 1.909-.008.5-.14.958-.398 1.375a2.94 2.94 0 0 1-.989.988 2.576 2.576 0 0 1-1.34.364Z"
        fill="url(#b)"
      />
      <defs>
        <linearGradient id="a" x1={0} y1={0} x2={61.623} y2={9.609} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="b" x1={0} y1={0} x2={61.623} y2={9.609} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
