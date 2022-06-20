import { FC, useContext } from 'react';

import cx from 'classnames';
import { Link } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { extractTokens } from '@modules/stableswap/helpers';
import { StableswapRoutes } from '@modules/stableswap/stableswap-routes.enum';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import {
  Card,
  ListItemCardCell,
  StateCurrencyAmount,
  StatusLabel,
  TokensLogos,
  TokensSymbols
} from '@shared/components';

import { StableFarmFormTabs, StableFarmItem, StakerInfo } from '../../../../../types';
import styles from './farm-card.module.scss';
import { useFarmCardViewModel } from './farm-card.vm';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props extends StableFarmItem, StakerInfo {
  className?: string;
  shouldShowStakerInfo?: boolean;
}

export const FarmCard: FC<Props> = ({
  tvl,
  apr,
  apy,
  tokensInfo,
  yourEarned,
  stakedToken,
  yourDeposit,
  isWhitelisted,
  stableFarmItemUrl,
  shouldShowStakerInfo,
  stakedTokenExchangeRate
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const { whitelistedTag, translation } = useFarmCardViewModel();

  const { status, label } = whitelistedTag;
  const { totalValueLockedTranslation, aprTranslation, apyTranslation, yourDeposiTranslation, yourEarnedTranslation } =
    translation;

  const tvlInDollars = tvl.multipliedBy(stakedTokenExchangeRate);
  const yourEarnedInDollars = yourEarned?.multipliedBy(stakedTokenExchangeRate);

  return (
    <Link
      to={`${AppRootRoutes.Stableswap}${StableswapRoutes.farming}/${StableFarmFormTabs.stake}/${stableFarmItemUrl}`}
    >
      <Card className={cx(styles.card, modeClass[colorThemeMode])} contentClassName={styles.poolCard}>
        <div className={styles.farmInfo}>
          <div className={styles.logoSymbols}>
            <TokensLogos className={styles.tokensLogos} tokens={extractTokens(tokensInfo)} width={48} />
            <TokensSymbols className={styles.tokensSymbols} tokens={extractTokens(tokensInfo)} />
          </div>

          {isWhitelisted && <StatusLabel className={styles.whitelistedTag} status={status} label={label} />}
        </div>
        <div className={styles.stats}>
          <ListItemCardCell
            cellName={totalValueLockedTranslation}
            cellNameClassName={styles.cardCellHeader}
            cardCellClassName={styles.cardCell}
          >
            <StateCurrencyAmount amount={tvl} dollarEquivalent={tvlInDollars} currency={DOLLAR} dollarEquivalentOnly />
          </ListItemCardCell>

          <ListItemCardCell
            cellName={aprTranslation}
            cellNameClassName={styles.cardCellHeader}
            cardCellClassName={styles.cardCell}
          >
            <StateCurrencyAmount amount={apr} currency={PERCENT} />
          </ListItemCardCell>

          <ListItemCardCell
            cellName={apyTranslation}
            cellNameClassName={styles.cardCellHeader}
            cardCellClassName={styles.cardCell}
          >
            <StateCurrencyAmount amount={apy} currency={PERCENT} />
          </ListItemCardCell>
          {shouldShowStakerInfo && (
            <div className={styles.userData}>
              <ListItemCardCell
                cellName={yourDeposiTranslation}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                <StateCurrencyAmount amount={yourDeposit} currency={stakedToken.metadata.symbol} />
              </ListItemCardCell>

              <ListItemCardCell
                cellName={yourEarnedTranslation}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                <StateCurrencyAmount
                  amount={yourEarned}
                  dollarEquivalent={yourEarnedInDollars}
                  currency={DOLLAR}
                  dollarEquivalentOnly
                />
              </ListItemCardCell>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
