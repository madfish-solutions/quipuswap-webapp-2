import { useContext, useEffect } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';

import { QUIPUSWAP } from '../app.config';

export const useBaseLayoutViewModel = () => {
  const { colorThemeMode, isComponentDidMount } = useContext(ColorThemeContext);


  /*
    Set Theme ClassName to the body
   */
  useEffect(() => {
    if (colorThemeMode === ColorModes.Dark) {
      document.querySelector('body')?.classList.add(ColorModes.Dark);
    } else {
      document.querySelector('body')?.classList.remove(ColorModes.Dark);
    }
  }, [colorThemeMode]);

  const isDarkFavicon = colorThemeMode === ColorModes.Dark;
  const canonicalURL = QUIPUSWAP + useRouter().asPath;

  return { isDarkFavicon, canonicalURL, isComponentDidMount };
};
