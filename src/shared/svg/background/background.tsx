import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';

import { isClient } from '../../helpers';
import DarkBackground from './Desktopdark.png';
import LightBackground from './Desktoplight.png';

export const Background: FC<IconProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (!isClient) {
    return null;
  }

  return (
    <img
      src={`${colorThemeMode === 'dark' ? DarkBackground : LightBackground}`}
      alt="background"
      className={className}
    />
  );
};
