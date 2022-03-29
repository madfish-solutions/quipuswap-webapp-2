import { useContext, useEffect } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import { useLocation } from 'react-router-dom';

import { QUIPUSWAP } from '@config/config';

// import { useAuthStore } from '@shared/hooks/use-auth-store';
// import { useUiStore } from '@shared/hooks/use-ui-store';
// import { useRootStore } from 'providers/root-store-provider';
// import { useAccountPkh, useTezos } from 'providers/use-dapp';

export const useBaseLayoutViewModel = () => {
  // const rootStore = useRootStore();
  // const uiStore = useUiStore();
  // const authStore = useAuthStore();
  // const accountPkh = useAccountPkh();
  // const tezos = useTezos();
  const { colorThemeMode } = useContext(ColorThemeContext); // isComponentDidMount

  /*
    Set TezosToolkit
   */
  // useEffect(() => {
  //   rootStore.setTezos(tezos);
  // }, [rootStore, tezos]);

  /*
    Set Auth Data
   */
  // useEffect(() => {
  //   authStore.setAccountPkh(accountPkh);
  // }, [authStore, accountPkh]);

  /*
    Set UI Data
   */
  // useEffect(() => {
  //   uiStore.setColorThemeMode(colorThemeMode);
  // }, [uiStore, colorThemeMode]);

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
  const canonicalURL = QUIPUSWAP + useLocation().pathname;

  return { isDarkFavicon, canonicalURL, isComponentDidMount: true };
};
