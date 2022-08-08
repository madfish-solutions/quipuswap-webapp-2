import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { getTokenPairSlug, isNull } from '@shared/helpers';
import { ActiveStatus, Token } from '@shared/types';
import { i18n } from '@translation';

import { LiquidityTabs } from '../liquidity';
import { StableswapRoutes } from '../stableswap';
import { LiquidityItemResponse } from './interfaces';

const getLiquidityHref = (id: BigNumber, type: string, tokens: Array<Token>) => {
  const aToken = tokens[0];
  const bToken = tokens[1];

  switch (type) {
    case 'DEX_TWO':
      return `${AppRootRoutes.Liquidity}/cpmm/${getTokenPairSlug(aToken, bToken)}`;
    case 'TOKEN_TOKEN':
      return `${AppRootRoutes.Liquidity}/${LiquidityTabs.Add}/${getTokenPairSlug(aToken, bToken)}`;
    case 'STABLESWAP':
      return `${AppRootRoutes.Stableswap}/${StableswapRoutes.liquidity}/${id.toFixed()}`;
    default:
      return `${AppRootRoutes.Liquidity}`;
  }
};

export const newLiquidityListDataHelper = ({
  item: { id, tokensInfo, tvlInUsd, apr, maxApr, volumeForWeek, type }
}: LiquidityItemResponse) => {
  const tokens = tokensInfo.map(({ token }) => token);

  return {
    href: getLiquidityHref(id, type, tokens),
    inputToken: tokens,
    status: { status: ActiveStatus.ACTIVE, filled: true },
    itemStats: [
      {
        cellName: i18n.t('newLiquidity|TVL'),
        tooltip: 'TVL tooltip',
        amounts: {
          amount: tvlInUsd,
          currency: DOLLAR,
          dollarEquivalent: tvlInUsd,
          dollarEquivalentOnly: true
        }
      },
      {
        cellName: i18n.t('newLiquidity|volume'),
        tooltip: 'Volume tooltip',
        amounts: {
          amount: volumeForWeek,
          currency: DOLLAR,
          dollarEquivalent: volumeForWeek,
          dollarEquivalentOnly: true,
          isError: isNull(volumeForWeek)
        }
      },
      {
        cellName: i18n.t('newLiquidity|APR'),
        tooltip: 'APR tooltip',
        amounts: {
          amount: apr,
          currency: PERCENT,
          isError: isNull(apr)
        }
      },
      {
        cellName: i18n.t('newLiquidity|maxApr'),
        tooltip: 'Max APR tooltip',
        amounts: {
          amount: maxApr,
          currency: PERCENT,
          isError: isNull(maxApr)
        }
      }
    ]
  };
};
