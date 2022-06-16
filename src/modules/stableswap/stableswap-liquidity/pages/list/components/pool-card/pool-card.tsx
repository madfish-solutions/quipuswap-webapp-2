import { FC, useContext } from 'react';

import cx from 'classnames';
import { Link } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import {
  Card,
  Iterator,
  ListItemCardCell,
  TokensLogos,
  StateCurrencyAmount,
  StatusLabel,
  TokensSymbols
} from '@shared/components';

import { extractTokens } from '../../../../../helpers';
import { StableswapRoutes } from '../../../../../stableswap-routes.enum';
import { StableswapFormTabs, StableswapItem } from '../../../../../types';
import { preparePoolAmounts } from './pool-card.helpers';
import styles from './pool-card.module.scss';
import { usePoolCardViewModel } from './pool-card.vm';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props extends StableswapItem {
  className?: string;
}

export const PoolCard: FC<Props> = ({
  tokensInfo,
  tvlInUsd,
  isWhitelisted,
  liquidityProvidersFee,
  stableswapItemUrl
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const { whitelistedTag, translation } = usePoolCardViewModel();

  const { status, label } = whitelistedTag;
  const { totalValueTranslation, liquidityProvidersFeeTranslation, valueTranslation } = translation;

  return (
    <Link
      to={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapFormTabs.add}/${stableswapItemUrl}`}
    >
      <Card className={cx(styles.card, modeClass[colorThemeMode])} contentClassName={styles.poolCard}>
        <div className={styles.poolInfo}>
          <div className={styles.logoSymbols}>
            <TokensLogos className={styles.tokensLogos} tokens={extractTokens(tokensInfo)} width={48} />
            <TokensSymbols className={styles.tokensSymbols} tokens={extractTokens(tokensInfo)} />
          </div>

          {isWhitelisted && <StatusLabel className={styles.whitelistedTag} status={status} label={label} filled />}
        </div>
        <div className={styles.stats}>
          <ListItemCardCell
            cellName={valueTranslation}
            cellNameClassName={styles.cardCellHeader}
            cardCellClassName={styles.tokensValue}
          >
            <Iterator
              isGrouped
              wrapperClassName={styles.tokensInfo}
              render={StateCurrencyAmount}
              data={preparePoolAmounts(tokensInfo)}
            />
          </ListItemCardCell>

          <div className={styles.poolStats}>
            <ListItemCardCell
              cellName={totalValueTranslation}
              cellNameClassName={styles.cardCellHeader}
              cardCellClassName={styles.cardCell}
            >
              <StateCurrencyAmount
                className={styles.poolStatsAmount}
                amount={tvlInUsd}
                currency={DOLLAR}
                isLeftCurrency
              />
            </ListItemCardCell>

            <ListItemCardCell
              cellName={liquidityProvidersFeeTranslation}
              cellNameClassName={styles.cardCellHeader}
              cardCellClassName={styles.cardCell}
            >
              <StateCurrencyAmount
                className={styles.poolStatsAmount}
                amount={liquidityProvidersFee}
                currency={PERCENT}
              />
            </ListItemCardCell>
          </div>
        </div>
      </Card>
    </Link>
  );
};
