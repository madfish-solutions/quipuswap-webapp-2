import { FC, useContext } from 'react';

import cx from 'classnames';

import { AppRootRoutes } from '@app.router';
import { StableswapRoutes, Tabs } from '@modules/stableswap/stableswap.page';
import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { Button, Card, StateCurrencyAmount } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './create-new-pool.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const CreateNewPool: FC = () => {
  const { t } = useTranslation(['stableswap']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Card className={styles.cardRoot} contentClassName={styles.cardContent}>
      <div className={cx(styles.tvl, modeClass[colorThemeMode])}>
        <div className={styles.tvlTitle}>{t('stableswap|tvl')}</div>
        <StateCurrencyAmount amount={10000} currency="$" isLeftCurrency className={styles.amount} />
      </div>
      <div className={cx(styles.createPool, modeClass[colorThemeMode])}>
        <div className={cx(styles.poolCreateDescription, modeClass[colorThemeMode])}>
          {t('stableswap|createOwnPool')}
        </div>
        <Button className={styles.button} href={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}${Tabs.add}`}>
          {t('stableswap|createPool')}
        </Button>
      </div>
    </Card>
  );
};
