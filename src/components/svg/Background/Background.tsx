import React, {useContext} from 'react';

import {ColorModes, ColorThemeContext} from '@providers/ColorThemeContext';

import {DesktopDark} from './DesktopDark';
import {DesktopLight} from './DesktopLight';
import {MobileDark} from './MobileDark';
import {MobileLight} from './MobileLight';

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
