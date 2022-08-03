import { useEffect } from 'react';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { LabelComponentProps } from '@shared/components';
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

  const listData = list?.map(({ id, tokensInfo, tvlInUsd, isWhitelisted, providersFee }) => {
    const idFixed = id.toFixed();
    const labels: Array<LabelComponentProps> = [];

    if (isWhitelisted) {
      labels.push({
        status: ActiveStatus.ACTIVE,
        label: t('common|whiteListed').toUpperCase(),
        DTI: 'whitelistedLabel'
      });
    }

    return {
      farmingItemDTI: `farming-item-${idFixed}`,
      href: `${link}/${idFixed}`,
      inputToken: extractTokens(tokensInfo),
      labels,
      status: {
        status: ActiveStatus.ACTIVE,
        DTI: 'activeLabel',
        filled: true
      },
      itemStats: [
        ...tokensInfo.map(({ reserves, reservesInUsd, token }, index) => ({
          cellName: t('common|tokenValue'),
          tooltip: t('stableswap|tokenValuesTooltip'),
          DTI: `tokenValues-${index}`,
          amounts: {
            amount: reserves,
            dollarEquivalent: reservesInUsd,
            currency: getTokenSymbol(token)
          }
        })),
        {
          cellName: t('common|tvl'),
          tooltip: t('stableswap|tvlPoolTooltip'),
          DTI: 'tvlPool',
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
          DTI: 'lpFee',
          amounts: {
            amount: providersFee,
            currency: PERCENT
          }
        }
      ]
    };
  });

  return {
    isLoading,
    list: listData ?? [],
    title
  };
};
