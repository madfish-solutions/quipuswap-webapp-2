import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const StableswapIcon: FC<IconProps> = ({ className, id, ...props }) => {
  const { themeColors } = useContext(ColorThemeContext);

  const getId = (name: string) => `StableswapIcon-${id}-${name}`;

  return (
    <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path
        clipRule="evenodd"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        stroke={`url(#${getId('a')})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 15.75V17h5.5a2.5 2.5 0 0 0 2.5-2.5v0a2.5 2.5 0 0 0-2.5-2.5H10a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6v1.25"
        stroke={`url(#${getId('b')})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5v14"
        stroke={`url(#${getId('c')})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={getId('a')} x1={2} y1={2} x2={24.37} y2={5.146} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('b')} x1={8} y1={17} x2={9.945} y2={5.936} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('c')} x1={12} y1={5} x2={13.14} y2={5.011} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
