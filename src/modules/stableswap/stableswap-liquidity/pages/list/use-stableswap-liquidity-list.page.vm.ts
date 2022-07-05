import { useEffect } from 'react';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { getTokenSymbol } from '@shared/helpers';
import { ActiveStatus } from '@shared/types';
import { useTranslation } from '@translation';

import { extractTokens } from '../../../helpers';
import { useStableswapListStore, useGetStableswapList, useGetStableswapStats } from '../../../hooks';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { StableswapLiquidityFormTabs } from '../../../types';

export const useStableswapLiquidityPageViewModel = () => {
  const stableswapListStore = useStableswapListStore();
  const isReady = useReady();
  const { getStableswapList } = useGetStableswapList();
  const { getStableswapStats } = useGetStableswapStats();

  const { t } = useTranslation();
  const title = t('common|Stableswap Liquidity');
  const link = `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapLiquidityFormTabs.add}`;

  /*
    Load data
  */
  useEffect(() => {
    if (isReady) {
      void getStableswapList();
      void getStableswapStats();
    }
  }, [getStableswapList, getStableswapStats, isReady]);

  const { listStore, list } = stableswapListStore;
  const { isLoading } = listStore;

  const listData = list?.map(({ stableswapItemUrl, tokensInfo, tvlInUsd, liquidityProvidersFee }) => ({
    href: `${link}/${stableswapItemUrl}`,
    inputToken: extractTokens(tokensInfo),
    status: { status: ActiveStatus.ACTIVE, label: t('common|whiteListed'), filled: true },
    itemStats: [
      ...tokensInfo.map(({ reserves, reservesInUsd, token }) => ({
        cellName: t('common|tokenValue'),
        tooltip: t('stableswap|tokenValuesTooltip'),
        amounts: {
          amount: reserves,
          dollarEquivalent: reservesInUsd,
          currency: getTokenSymbol(token)
        }
      })),
      {
        cellName: t('common|tvl'),
        tooltip: t('stableswap|tvlPoolTooltip'),
        amounts: {
          amount: tvlInUsd,
          currency: DOLLAR,
          dollarEquivalent: tvlInUsd,
          dollarEquivalentOnly: true
        }
      },
      {
        cellName: t('stableswap|liquidityProvidersFee'),
        tooltip: t('stableswap|liquidityProvidersFeeTooltip'),
        amounts: {
          amount: liquidityProvidersFee,
          currency: PERCENT
        }
      }
    ]
  }));

  return {
    isLoading,
    list: listData ?? [],
    title
  };
};
