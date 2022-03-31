import { useContext, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { QUIPUSWAP } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

export const useLayoutViewModel = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  useEffect(() => {
    if (colorThemeMode === ColorModes.Dark) {
      document.querySelector('body')?.classList.add(ColorModes.Dark);
    } else {
      document.querySelector('body')?.classList.remove(ColorModes.Dark);
    }
  }, [colorThemeMode]);

  const isDarkFavicon = colorThemeMode === ColorModes.Dark;
  const canonicalURL = QUIPUSWAP + useLocation().pathname;

  return { isDarkFavicon, canonicalURL, isComponentDidMount: true };
};
