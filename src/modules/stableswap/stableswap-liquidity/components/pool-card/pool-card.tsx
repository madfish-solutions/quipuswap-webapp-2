import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';

import { DOLLAR, PERCENT } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import {
  Button,
  Card,
  Iterator,
  ListItemCardCell,
  TokensLogos,
  StateCurrencyAmount,
  StatusLabel,
  TokensSymbols
} from '@shared/components';

import { extractTokens, preparePoolAmounts } from './pool-card.helpers';
import styles from './pool-card.module.scss';
import { usePoolCardViewModel } from './pool-card.vm';
import { PreparedTokenData } from './types';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  tvlInUsd: BigNumber;
  isWhitelisted: boolean;
  liquidityProvidersFee: BigNumber;
  poolContractUrl: string;
  tokensInfo: Array<PreparedTokenData>;
}

export const PoolCard: FC<Props> = ({
  tokensInfo,
  tvlInUsd,
  isWhitelisted,
  liquidityProvidersFee,
  poolContractUrl
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const { whitelistedTag, translation } = usePoolCardViewModel();

  const { status, label } = whitelistedTag;
  const { totalValueTranslation, liquidityProvidersFeeTranslation, selectTranslation, valueTranslation } = translation;

  return (
    <Card className={modeClass[colorThemeMode]} contentClassName={styles.poolCard}>
      <div className={styles.info}>
        <div className={styles.poolInfo}>
          <div className={styles.logoSymbols}>
            <TokensLogos className={styles.tokensLogos} tokens={extractTokens(tokensInfo)} width={48} />
            <TokensSymbols className={styles.tokensSymbols} tokens={extractTokens(tokensInfo)} />
          </div>

          {isWhitelisted && <StatusLabel className={styles.whitelistedTag} status={status} label={label} filled />}
        </div>

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
            // tooltip={tvlTooltipTranslation}
            cellNameClassName={styles.cardCellHeader}
            cardCellClassName={styles.cardCell}
          >
            <StateCurrencyAmount className={styles.poolStatsAmount} amount={liquidityProvidersFee} currency={PERCENT} />
          </ListItemCardCell>
        </div>
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

        <Button className={styles.button} href={poolContractUrl}>
          {selectTranslation}
        </Button>
      </div>
    </Card>
  );
};
