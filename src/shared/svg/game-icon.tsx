import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const GameIcon: FC<IconProps> = ({ id, className }) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx={17} cy={13} r={2} stroke="url(#a)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6 7.75h12A3.25 3.25 0 0 1 21.25 11v7.334a2.915 2.915 0 0 1-5.558 1.233l-.474-1.016a2.75 2.75 0 0 0-2.492-1.587h-1.452a2.75 2.75 0 0 0-2.492 1.587l-.474 1.016a2.916 2.916 0 0 1-5.558-1.233V11A3.25 3.25 0 0 1 6 7.75Z"
        stroke={`url(#GameIcon-${id}paint0_linear)`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m12.044 7.517-.035-2 1.982-1.034-.035-2"
        stroke={`url(#GameIcon-${id}paint1_linear)`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14.88v-4"
        stroke={`url(#GameIcon-${id}paint2_linear)`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12.88h4"
        stroke={`url(#GameIcon-${id}paint3_linear)`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={`GameIcon-${id}paint0_linear`}
          x1={15}
          y1={11}
          x2={19.474}
          y2={11.629}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`GameIcon-${id}paint1_linear`}
          x1={2}
          y1={7}
          x2={24.038}
          y2={11.132}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`GameIcon-${id}paint2_linear`}
          x1={11.957}
          y1={2.518}
          x2={14.232}
          y2={2.606}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`GameIcon-${id}paint3_linear`}
          x1={7}
          y1={14.88}
          x2={8.95}
          y2={11.415}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`GameIcon-${id}paint4_linear`}
          x1={5}
          y1={12.88}
          x2={8.466}
          y2={14.83}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
