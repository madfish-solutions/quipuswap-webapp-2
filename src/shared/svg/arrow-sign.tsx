import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

interface Props extends IconProps {
  rotation?: boolean;
}

export const ArrowSign: FC<Props> = ({ className, rotation }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <svg
      className={className}
      transform={rotation ? 'rotate(180 0 0)' : undefined}
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.59 0.589966L6 5.16997L1.41 0.589966L0 1.99997L6 7.99997L12 1.99997L10.59 0.589966Z"
        fill={`url(#arrow-sign-${colorThemeMode}paint0_linear)`}
      />
      <defs>
        <linearGradient
          id={`arrow-sign-${ColorModes.Light}paint0_linear`}
          x1="1"
          y1="1"
          x2="25.6071"
          y2="4.46038"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F4BFF" />
          <stop offset="1" stopColor="#B04BFF" />
        </linearGradient>

        <linearGradient
          id={`arrow-sign-${ColorModes.Dark}paint0_linear`}
          x1="3"
          y1="3"
          x2="23.1331"
          y2="5.83122"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6B00" />
          <stop offset="1" stopColor="#F9A605" />
        </linearGradient>
      </defs>
    </svg>
  );
};
