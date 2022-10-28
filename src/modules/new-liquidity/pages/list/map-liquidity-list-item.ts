import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { DexLink } from '@modules/new-liquidity/helpers';
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
      cellName: i18n.t('newLiquidity|TVL'),
      tooltip: i18n.t('newLiquidity|tvlTooltip'),
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
      cellName: i18n.t('newLiquidity|volume'),
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
      cellName: i18n.t('newLiquidity|APR'),
      tooltip: 'APR tooltip',
      amounts: {
        amount: apr,
        currency: PERCENT
      }
    });
  }

  if (!isNull(maxApr)) {
    itemStats.push({
      cellName: i18n.t('newLiquidity|maxApr'),
      tooltip: i18n.t('newLiquidity|maxAprTooltip'),
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
    maxApr,
    itemStats,
    categories: poolLabels,
    visibleIcon: false,
    inputToken: tokens,
    href: getLiquidityHref(id, type, tokens),
    status: { status: ActiveStatus.ACTIVE, filled: true }
  };
};
