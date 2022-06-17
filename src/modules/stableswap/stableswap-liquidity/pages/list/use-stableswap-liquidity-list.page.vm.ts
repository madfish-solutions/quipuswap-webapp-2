import { useEffect } from 'react';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { ActiveStatus } from '@shared/types';
import { useTranslation } from '@translation';

import { extractTokens } from '../../../helpers';
import { useStableswapListStore, useGetStableswapList, useGetStableswapStats } from '../../../hooks';
import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { Tabs } from '../../tabs.enum';

export const useStableswapLiquidityPageViewModel = () => {
  const stableswapListStore = useStableswapListStore();
  const isReady = useReady();
  const { getStableswapList } = useGetStableswapList();
  const { getStableswapStats } = useGetStableswapStats();

  const { t } = useTranslation();
  const title = t('common|Stableswap Liquidity');
  const link = `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${Tabs.add}`;

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
      ...tokensInfo.map(info => ({
        cellName: t('common|tokenValue'),
        amounts: {
          amount: info.reserves,
          dollarEquivalent: info.reservesInUsd,
          currency: info.token.metadata.symbol
        }
      })),
      {
        cellName: t('common|tvl'),
        amounts: {
          amount: tvlInUsd,
          currency: DOLLAR,
          dollarEquivalent: tvlInUsd,
          dollarEquivalentOnly: true
        }
      },
      {
        cellName: t('stableswap|liquidityProvidersFee'),
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
