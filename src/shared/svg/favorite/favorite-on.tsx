import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const FavoriteOn: FC<IconProps> = ({ className, id, ...props }) => {
  const { themeColors } = useContext(ColorThemeContext);

  const getId = (name: string) => `FavoriteOn-${id}-${name}`;

  return (
    <svg width={20} height={19} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19 10 15.27Z"
        fill={`url(#${getId('a')})`}
      />
      <defs>
        <linearGradient id={getId('a')} x1={2} y1={2} x2={24.37} y2={5.146} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
