import { FC, useContext } from 'react';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { isEqual } from '@shared/helpers';
import { IconProps } from '@shared/types';

import { TempleIconDark } from './temple-icon-dark';
import { TempleIconLight } from './temple-icon-light';

export const TempleIcon: FC<IconProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return isEqual(colorThemeMode, ColorModes.Dark) ? (
    <TempleIconDark className={className} />
  ) : (
    <TempleIconLight className={className} />
  );
};
