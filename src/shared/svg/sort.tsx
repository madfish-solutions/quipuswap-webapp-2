import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

interface Props extends IconProps {
  rotation?: boolean;
}

export const Sort: FC<Props> = ({ className, rotation }) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      transform={rotation ? 'rotate(180 0 0)' : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="url(#paint0_linear_7138_88808)" />
      <defs>
        <linearGradient
          id="paint0_linear_7138_88808"
          x1="3"
          y1="6"
          x2="22.6566"
          y2="10.1463"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
