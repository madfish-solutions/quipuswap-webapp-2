import React, { useContext } from 'react';

import { ColorModes as ColorMode, ColorThemeContext } from '@quipuswap/ui-kit';
import { isClient } from '@utils/helpers';

function getBackgroundPath(isDesktop: boolean, themeMode: ColorMode = ColorMode.Light) {
  return `/svg/${isDesktop ? 'Desktop' : 'Mobile'}${themeMode}.svg`;
}

export const Background: React.FC<IconProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (!isClient) return null;

  const isDesktop = window.innerWidth > 1024;

  return (
    <img
      src={getBackgroundPath(isDesktop, colorThemeMode)}
      alt="background"
      className={className}
    />
  );
};
