import { useContext, useEffect } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import { useRouter } from 'next/router';

import { QUIPUSWAP } from '@app.config';
import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useUiStore } from '@hooks/stores/use-ui-store';
import { useRootStore } from '@providers/RootStoreProvider';
import { useAccountPkh, useTezos } from '@utils/dapp';

export const useBaseLayoutViewModel = () => {
  const rootStore = useRootStore();
  const uiStore = useUiStore();
  const authStore = useAuthStore();
  const accountPkh = useAccountPkh();
  const tezos = useTezos();
  const { colorThemeMode, isComponentDidMount } = useContext(ColorThemeContext);

  /*
    Set TezosToolkit
   */
  useEffect(() => {
    rootStore.setTezos(tezos);
  }, [rootStore, tezos]);

  /*
    Set Auth Data
   */
  useEffect(() => {
    authStore.setAccountPkh(accountPkh);
  }, [authStore, accountPkh]);

  /*
    Set UI Data
   */
  useEffect(() => {
    uiStore.setColorThemeMode(colorThemeMode);
  }, [uiStore, colorThemeMode]);

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
