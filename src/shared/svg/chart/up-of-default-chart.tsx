import { FC, useContext } from 'react';

import { COLORS } from '@config/constants';
import { ColorThemeContext } from '@providers/color-theme-context';
import { isEqual } from '@shared/helpers';
import { IconProps } from '@shared/types';

export const UpOfDefaultChart: FC<IconProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const currentFill = isEqual(colorThemeMode, 'dark') ? COLORS[1] : COLORS[0];

  return (
    <svg width={200} height={100} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M100 0A100 100 0 0 0 0 100h20a80.002 80.002 0 0 1 80-80V0Zm100 100a100.008 100.008 0 0 0-29.289-70.71A100 100 0 0 0 100 0v20a80.002 80.002 0 0 1 80 80h20Z"
        fill={currentFill}
      />
    </svg>
  );
};
