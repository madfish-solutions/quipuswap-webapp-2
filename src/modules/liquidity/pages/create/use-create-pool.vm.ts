import { useMemo } from 'react';

import cx from 'classnames';

import { AppRootRoutes } from '@app.router';
import { STABLESWAP_V2_IS_AVAILABLE } from '@config/config';
import CreateHighEfficiencyPoolDark from '@images/create-efficient-pool-dark.png';
import CreateHighEfficiencyPoolLight from '@images/create-efficient-pool-light.png';
import CreateNewStablePoolDark from '@images/create-new-stable-pool-dark.png';
import CreateNewStablePoolLight from '@images/create-new-stable-pool-light.png';
import CreateRegularPoolDark from '@images/create-regular-pool-dark.png';
import CreateRegularPoolLight from '@images/create-regular-pool-light.png';
import CreateStablePoolDark from '@images/create-stable-pool-dark.png';
import CreateStablePoolLight from '@images/create-stable-pool-light.png';
import { LiquidityRoutes } from '@modules/liquidity/liquidity-routes.enum';
import { StableswapRoutes } from '@modules/stableswap';
import { StableswapLiquidityFormTabs } from '@modules/stableswap/types';
import { ColorModes } from '@providers/color-theme-context';
import { isEqual, isExist } from '@shared/helpers';
import { useUiStore } from '@shared/hooks';
import { useTranslation } from '@translation';

import styles from './create-pool.module.scss';

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

  const createPoolOptionsProps = useMemo(
    () =>
      [
        {
          imageAlt: 'Create high efficiency pool icon',
          imageUrl: createHighEfficiencyPoolIcon,
          name: t('liquidity|highEfficiencyPool'),
          href: `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}${LiquidityRoutes.create}`
        },
        {
          imageAlt: 'Create regular pool icon',
          imageUrl: createRegularPoolIcon,
          name: t('liquidity|regularPool'),
          href: `${AppRootRoutes.Liquidity}${LiquidityRoutes.cpmm}${LiquidityRoutes.create}`
        },
        {
          imageAlt: 'Create stable pool icon',
          imageUrl: createStablePoolIcon,
          name: t('liquidity|stablePool'),
          href: `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapLiquidityFormTabs.create}`
        },
        STABLESWAP_V2_IS_AVAILABLE
          ? {
              imageAlt: 'Create new stable pool icon',
              imageUrl: createNewStablePoolIcon,
              name: t('liquidity|yupanaStablePool'),
              href: `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapLiquidityFormTabs.create}?v2=true`
            }
          : null
      ].filter(isExist),
    [createHighEfficiencyPoolIcon, createNewStablePoolIcon, createRegularPoolIcon, createStablePoolIcon, t]
  );

  return {
    cardContentClassName: cx(styles.cardContent, STABLESWAP_V2_IS_AVAILABLE ? styles.twoColumns : styles.threeColumns),
    createPool: t('liquidity|createPool'),
    back: t('liquidity|back'),
    createPoolOptionsProps
  };
};
