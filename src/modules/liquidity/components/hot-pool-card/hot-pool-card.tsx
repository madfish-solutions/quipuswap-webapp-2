import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { DOLLAR, PERCENT } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card, DashboardCard, TokensLogos, TokensSymbols } from '@shared/components';
import { isExist } from '@shared/helpers';
import { Confettis } from '@shared/svg';
import { Nullable, Token } from '@shared/types';
import { useTranslation } from '@translation';

import styles from './hot-pool-card.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  tvl: BigNumber;
  apr: Nullable<number>;
  tokens: Array<Token>;
  href: string;
}

const ZERO_APR = '0';

export const HotPoolCard: FC<Props> = ({ tvl, apr, tokens, href }) => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);

  const fixedTvl = tvl.toString();
  const fixedApr = apr?.toString() ?? ZERO_APR;

  return (
    <Link to={href}>
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
              volume={fixedTvl}
              label={t('liquidity|TVL')}
              currency={DOLLAR}
              data-test-id="TVL"
            />
            {isExist(apr) && (
              <DashboardCard
                stateCurrencyClassName={cx(styles.amountClassName, modeClass[colorThemeMode])}
                className={cx(styles.dashboardCard, modeClass[colorThemeMode])}
                size="large"
                volume={fixedApr}
                label={t('liquidity|aprUpTo')}
                currency={PERCENT}
                data-test-id="aprUpTo"
              />
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
