import cx from 'classnames';

import CreateHighEfficiencyPoolDark from '@images/create-efficient-pool-dark.png';
import CreateHighEfficiencyPoolLight from '@images/create-efficient-pool-light.png';
import CreateNewStablePoolDark from '@images/create-new-stable-pool-dark.png';
import CreateNewStablePoolLight from '@images/create-new-stable-pool-light.png';
import CreateRegularPoolDark from '@images/create-regular-pool-dark.png';
import CreateRegularPoolLight from '@images/create-regular-pool-light.png';
import CreateStablePoolDark from '@images/create-stable-pool-dark.png';
import CreateStablePoolLight from '@images/create-stable-pool-light.png';
import { ColorModes } from '@providers/color-theme-context';
import { isEqual } from '@shared/helpers';
import { useUiStore } from '@shared/hooks';
import { useTranslation } from '@translation';

import styles from './create-pool.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const useCreatePoolViewModel = () => {
  const uiStore = useUiStore();
  const { t } = useTranslation();
  const shouldUseDarkIcons = isEqual(uiStore.colorThemeMode, ColorModes.Dark);

  const createHighEfficiencyPoolIcon = shouldUseDarkIcons
    ? CreateHighEfficiencyPoolDark
    : CreateHighEfficiencyPoolLight;

  const createRegularPoolIcon = shouldUseDarkIcons ? CreateRegularPoolDark : CreateRegularPoolLight;

  const createNewStablePoolIcon = shouldUseDarkIcons ? CreateNewStablePoolDark : CreateNewStablePoolLight;
  const createStablePoolIcon = shouldUseDarkIcons ? CreateStablePoolDark : CreateStablePoolLight;

  const translations = {
    createPool: t('liquidity|createPool'),
    highEfficiencyPool: t('liquidity|highEfficiencyPool'),
    regularPool: t('liquidity|regularPool'),
    stablePool: t('liquidity|stablePool'),
    back: t('liquidity|back')
  };

  return {
    cardContentClassName: cx(modeClass[uiStore.colorThemeMode], styles.cardContent),
    translations,
    createHighEfficiencyPoolIcon,
    createNewStablePoolIcon,
    createRegularPoolIcon,
    createStablePoolIcon
  };
};
