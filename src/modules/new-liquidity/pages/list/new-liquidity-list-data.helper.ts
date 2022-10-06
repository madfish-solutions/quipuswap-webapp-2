import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { NewLiquidityRoutes } from '@modules/new-liquidity/new-liquidity-routes.enum';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { getTokenPairSlug, isNull } from '@shared/helpers';
import { ActiveStatus, Token } from '@shared/types';
import { i18n } from '@translation';

import { LiquidityTabs } from '../../../liquidity';
import { StableswapRoutes } from '../../../stableswap';
import { LiquidityItemResponse } from '../../interfaces';

const getLiquidityHref = (id: BigNumber, type: string, tokens: Array<Token>) => {
  const [aToken, bToken] = tokens;

  switch (type) {
    case 'DEX_TWO':
      return `${AppRootRoutes.NewLiquidity}${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.add}/${getTokenPairSlug(
        aToken,
        bToken
      )}`;
    case 'TOKEN_TOKEN':
      return `${AppRootRoutes.Liquidity}/${LiquidityTabs.Add}/${getTokenPairSlug(aToken, bToken)}`;
    case 'STABLESWAP':
      return `${AppRootRoutes.Stableswap}/${StableswapRoutes.liquidity}/${id.toFixed()}`;
    default:
      return `${AppRootRoutes.Liquidity}`;
  }
};

export const newLiquidityListDataHelper = ({
  item: { id, tokensInfo, tvlInUsd, apr, maxApr, volumeForWeek, type, poolLabels }
}: LiquidityItemResponse) => {
  const tokens = tokensInfo.map(({ token }) => token);
  const itemStats = [];

  if (!isNull(tvlInUsd)) {
    itemStats.push({
      cellName: i18n.t('newLiquidity|TVL'),
      tooltip: 'TVL tooltip',
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
      tooltip: 'Max APR tooltip',
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
    visibleIcon: true,
    inputToken: tokens,
    href: getLiquidityHref(id, type, tokens),
    status: { status: ActiveStatus.ACTIVE, filled: true }
  };
};
