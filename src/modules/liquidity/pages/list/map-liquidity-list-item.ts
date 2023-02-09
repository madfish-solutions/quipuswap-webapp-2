import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT, ZERO_AMOUNT } from '@config/constants';
import { DexLink } from '@modules/liquidity/helpers';
import { isNull } from '@shared/helpers';
import { ActiveStatus, Token } from '@shared/types';
import { i18n } from '@translation';

import { LiquidityItemResponse, PoolType, PreparedLiquidityItem } from '../../interfaces';

const getLiquidityHref = (id: BigNumber, type: string, tokens: Array<Token>) => {
  const [aToken, bToken] = tokens;

  switch (type) {
    case PoolType.DEX_TWO:
      return DexLink.getCpmmPoolLink([aToken, bToken]);
    case PoolType.TOKEN_TOKEN:
    case PoolType.TEZ_TOKEN:
      return DexLink.getOldLiquidityPoolLink([aToken, bToken]);
    case PoolType.STABLESWAP:
      return DexLink.getStableswapPoolLink(id);
    case PoolType.UNISWAP:
      return DexLink.getLiquidityV3PoolLink(id);
    default:
      return `${AppRootRoutes.Liquidity}`;
  }
};

export const mapLiquidityListItem = ({
  item: { id, tokensInfo, tvlInUsd, apr, maxApr, volumeForWeek, type, poolLabels }
}: LiquidityItemResponse): PreparedLiquidityItem => {
  const tokens = tokensInfo.map(({ token }) => token);
  const itemStats = [];

  if (!isNull(tvlInUsd)) {
    itemStats.push({
      cellName: i18n.t('liquidity|TVL'),
      tooltip: i18n.t('liquidity|tvlTooltip'),
      amounts: {
        amount: tvlInUsd,
        currency: DOLLAR,
        dollarEquivalent: tvlInUsd,
        dollarEquivalentOnly: true
      }
    });
  }

  if (!isNull(volumeForWeek)) {
    itemStats.push({
      cellName: i18n.t('liquidity|volume'),
      tooltip: 'Volume tooltip',
      amounts: {
        amount: volumeForWeek,
        currency: DOLLAR,
        dollarEquivalent: volumeForWeek,
        dollarEquivalentOnly: true
      }
    });
  }

  if (!isNull(apr)) {
    itemStats.push({
      cellName: i18n.t('liquidity|APR'),
      tooltip: 'APR tooltip',
      amounts: {
        amount: apr,
        currency: PERCENT
      }
    });
  }

  if (!isNull(maxApr)) {
    itemStats.push({
      cellName: i18n.t('liquidity|maxApr'),
      tooltip: i18n.t('liquidity|maxAprTooltip'),
      amounts: {
        amount: maxApr,
        currency: PERCENT
      }
    });
  }

  return {
    id,
    type,
    tvlInUsd,
    maxApr: type === PoolType.UNISWAP ? maxApr : maxApr ?? ZERO_AMOUNT,
    itemStats,
    categories: poolLabels,
    inputToken: tokens,
    href: getLiquidityHref(id, type, tokens),
    status: { status: ActiveStatus.ACTIVE, filled: true }
  };
};
