import CreateRegularPoolDark from '@images/create-regular-pool-dark.png';
import CreateRegularPoolLight from '@images/create-regular-pool-light.png';
import CreateStablePoolDark from '@images/create-stable-pool-dark.png';
import CreateStablePoolLight from '@images/create-stable-pool-light.png';
import { ColorModes } from '@providers/color-theme-context';
import { useUiStore } from '@shared/hooks';
import { useTranslation } from '@translation';

export const useCreatePoolViewModel = () => {
  const uiStore = useUiStore();
  const { t } = useTranslation();

  const createRegularPoolIcon =
    uiStore.colorThemeMode === ColorModes.Dark ? CreateRegularPoolDark : CreateRegularPoolLight;

  const createStablePoolIcon =
    uiStore.colorThemeMode === ColorModes.Dark ? CreateStablePoolDark : CreateStablePoolLight;

  const translations = {
    createPool: t('liquidity|createPool'),
    regularPool: t('liquidity|regularPool'),
    stablePool: t('liquidity|stablePool'),
    back: t('liquidity|back')
  };

  return {
    translations,
    createRegularPoolIcon,
    createStablePoolIcon
  };
};