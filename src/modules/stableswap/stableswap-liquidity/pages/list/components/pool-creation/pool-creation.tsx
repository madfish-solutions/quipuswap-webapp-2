import { FC, useContext } from 'react';

import cx from 'classnames';

import { AppRootRoutes } from '@app.router';
import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { useTranslation } from '@translation';

import { StableswapRoutes } from '../../../../../stableswap-routes.enum';
import { Tabs } from '../../../../tabs.enum';
import styles from './pool-creation.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const PoolCreation: FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation('stableswap');

  return (
    <div className={cx(styles.createPool, modeClass[colorThemeMode])}>
      <div className={cx(styles.poolCreateDescription, modeClass[colorThemeMode])}>{t('stableswap|createOwnPool')}</div>
      <Button className={styles.button} href={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}${Tabs.add}`}>
        {t('stableswap|createPool')}
      </Button>
    </div>
  );
};
