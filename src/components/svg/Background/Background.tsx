import React, {useContext} from 'react';

import {ColorModes, ColorThemeContext} from '@providers/ColorThemeContext';
import {isClient} from '@utils/helpers';

export const Background: React.FC<IconProps> = ({className}) => {
  const {colorThemeMode} = useContext(ColorThemeContext);
  if (!isClient) return null;
  if (window.innerWidth > 1024) {
    if (colorThemeMode === ColorModes.Dark) {
      return <img src="/svg/DesktopDark.svg" alt="background" className={className} />;
    }
    return <img src="/svg/DesktopLight.svg" alt="background" className={className} />;
  }
  if (colorThemeMode === ColorModes.Dark) {
    return <img src="/svg/MobileDark.svg" alt="background" className={className} />;
  }
  return <img src="/svg/MobileLight.svg" alt="background" className={className} />;
};
