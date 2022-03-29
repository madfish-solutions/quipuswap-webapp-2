import { useContext, useEffect } from 'react';

import { ColorModes, ColorThemeContext } from '@providers';

import { QUIPUSWAP } from '@config';

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
  const canonicalURL = QUIPUSWAP + '2'; // useRouter().asPath

  return { isDarkFavicon, canonicalURL, isComponentDidMount };
};
