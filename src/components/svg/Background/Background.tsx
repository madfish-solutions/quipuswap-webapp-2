import React, {useContext} from 'react';

import {ColorModes, ColorThemeContext} from '@providers/ColorThemeContext';

import DesktopDark from '@icons/DesktopDark.svg';
import DesktopLight from '@icons/DesktopLight.svg';
import MobileDark from '@icons/MobileDark.svg';
import MobileLight from '@icons/MobileLight.svg';

export const Background: React.FC<IconProps> = ({className}) => {
  const {colorThemeMode} = useContext(ColorThemeContext);
  if (window.innerWidth > 1024) {
    if (colorThemeMode === ColorModes.Dark) {
      return <DesktopDark className={className} />;
    }
    return <DesktopLight className={className} />;
  }
  if (colorThemeMode === ColorModes.Dark) {
    return <MobileDark className={className} />;
  }
  return <MobileLight className={className} />;
};
