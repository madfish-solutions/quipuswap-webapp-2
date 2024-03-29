import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const SwapIcon: FC<IconProps> = ({ id, className }) => {
  const { themeColors } = useContext(ColorThemeContext);

  const getId = (name: string) => `SwapIcon-${id}-${name}`;

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M16 3.99976L19 6.99976L16 9.99976"
        stroke={`url(#${getId('a')})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 6.99976H18"
        stroke={`url(#${getId('b')})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 20.0002L4 17.0002L7 14.0002"
        stroke={`url(#${getId('c')})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 17.0002H5"
        stroke={`url(#${getId('d')})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={getId('a')} x1="16" y1="3.99976" x2="19.405" y2="4.23917" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('b')} x1="4" y1="6.99976" x2="7.27498" y2="13.4474" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('c')} x1="4" y1="14.0002" x2="7.40504" y2="14.2397" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('d')} x1="5" y1="17.0002" x2="8.27498" y2="23.4479" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
