import { FC, useContext } from 'react';

import cx from 'classnames';
import { Link } from 'react-router-dom';

import { DOLLAR, PERCENT } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card, DashboardCard, TokensLogos, TokensSymbols } from '@shared/components';
import { Confettis } from '@shared/svg';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

import styles from './hot-pool-card.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  tvl: string;
  apr: string;
  tokens: Array<Token>;
}

export const HotPoolCard: FC<Props> = ({ tvl, apr, tokens }) => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Link to={'/'}>
      <Card className={styles.card} contentClassName={styles.cardContent} banner="Hot Pools">
        <div className={styles.root}>
          <Confettis className={styles.confettis} />
          <div className={styles.tokensInfo}>
            <TokensLogos tokens={tokens} width={32} />
            <TokensSymbols tokens={tokens} className={cx(styles.tokensSymbols, modeClass[colorThemeMode])} />
          </div>
          <div className={styles.stats}>
            <DashboardCard
              stateCurrencyClassName={cx(styles.amountClassName, modeClass[colorThemeMode])}
              className={cx(styles.dashboardCard, modeClass[colorThemeMode])}
              size="large"
              volume={tvl}
              label={t('newLiquidity|TVL')}
              currency={DOLLAR}
              data-test-id="TVL"
            />
            <DashboardCard
              stateCurrencyClassName={cx(styles.amountClassName, modeClass[colorThemeMode])}
              className={cx(styles.dashboardCard, modeClass[colorThemeMode])}
              size="large"
              volume={apr}
              label={t('newLiquidity|aprUpTo')}
              currency={PERCENT}
              data-test-id="aprUpTo"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
};