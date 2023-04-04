import BigNumber from 'bignumber.js';

import { DexLink } from '@modules/liquidity/helpers';
import { LiquidityV3PositionWithStats } from '@modules/liquidity/types';
import { getTokensNames } from '@shared/helpers';
import { Token } from '@shared/types';
import { i18n } from '@translation';

import { PriceView } from '../components';

export const mapPositionViewModel = (
  tokenX: Token,
  tokenY: Token,
  poolId: BigNumber,
  isExchangeRatesError: boolean,
  shouldShowTokenXToYPrice: boolean
) => {
  return (positionWithStats: LiquidityV3PositionWithStats) => {
    const { stats, id } = positionWithStats;
    const { collectedFeesUsd, depositUsd, minRange, maxRange, isInRange } = stats;
    const tokensNames = getTokensNames([tokenY, tokenX]);

    return {
      href: DexLink.getLiquidityV3PositionLink(poolId, id),
      inputToken: [tokenX, tokenY],
      status: null,
      isNew: false,
      isInRange,
      labels: [],
      itemStats: [
        {
          cellName: i18n.t('liquidity|minPrice'),
          amounts: { amount: undefined },
          children: <PriceView price={shouldShowTokenXToYPrice ? maxRange : minRange} />,
          DTI: 'minPrice',
          tooltip: i18n.t('liquidity|minPriceTooltip')
        },
        {
          cellName: i18n.t('liquidity|maxPrice'),
          amounts: { amount: undefined },
          children: <PriceView price={shouldShowTokenXToYPrice ? minRange : maxRange} />,
          DTI: 'maxPrice',
          tooltip: i18n.t('liquidity|maxPriceTooltip')
        },
        {
          cellName: i18n.t('liquidity|Deposit'),
          amounts: {
            amount: depositUsd,
            dollarEquivalent: depositUsd,
            currency: tokensNames,
            dollarEquivalentOnly: true,
            isError: isExchangeRatesError
          },
          DTI: 'deposit',
          tooltip: i18n.t('liquidity|depositTooltip')
        },
        {
          cellName: i18n.t('liquidity|collectedFees'),
          amounts: {
            amount: collectedFeesUsd,
            dollarEquivalent: collectedFeesUsd,
            currency: tokensNames,
            dollarEquivalentOnly: true,
            isError: isExchangeRatesError
          },
          DTI: 'collectedFees',
          tooltip: i18n.t('liquidity|collectedFeesTooltip')
        }
      ],
      itemDTI: `liquidity-item-v3-${id.toFixed()}`
    };
  };
};
