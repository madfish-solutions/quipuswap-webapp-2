import { useContext, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { QUIPUSWAP_URL } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { useAuthStore, useUiStore } from '@shared/hooks';
import { amplitudeService } from '@shared/services';

export const useLayoutViewModel = () => {
  const rootStore = useRootStore();
  const uiStore = useUiStore();
  const authStore = useAuthStore();
  const accountPkh = useAccountPkh();
  const tezos = useTezos();
  const { colorThemeMode } = useContext(ColorThemeContext);

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
    amplitudeService.setUserProps('color_theme', colorThemeMode);
  }, [uiStore, colorThemeMode]);

  useEffect(() => {
    if (colorThemeMode === ColorModes.Dark) {
      document.querySelector('body')?.classList.add(ColorModes.Dark);
    } else {
      document.querySelector('body')?.classList.remove(ColorModes.Dark);
    }
  }, [colorThemeMode]);

  const isDarkTheme = colorThemeMode === ColorModes.Dark;
  const canonicalURL = QUIPUSWAP_URL + useLocation().pathname;

  return { isDarkTheme, canonicalURL, isComponentDidMount: true };
};
