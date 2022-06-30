import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { extractTokens } from '@modules/stableswap/helpers';
import { StableswapRoutes } from '@modules/stableswap/stableswap-routes.enum';
import { StableFarmFormTabs } from '@modules/stableswap/types';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { ActiveStatus } from '@shared/types';
import { useTranslation } from '@translation';

import { useGetStableFarmList, useStableFarmListStore } from '../../../hooks';

const DEFAULT_VALUE = new BigNumber('0');

export const useStableFarmListPageViewModel = () => {
  const isReady = useReady();
  const stableFarmListStore = useStableFarmListStore();
  const { getStableFarmList } = useGetStableFarmList();
  const { t } = useTranslation();
  const title = t('stableswap|stableFarmTitle');
  const accountPkh = useAccountPkh();

  useEffect(() => {
    if (isReady) {
      void getStableFarmList();
    }
  }, [getStableFarmList, isReady]);

  const { listStore, filteredList } = stableFarmListStore;
  const { isLoading } = listStore;

  const data = filteredList?.map(item => {
    const shouldShowUserStats =
      !isNull(accountPkh) && (item.yourDeposit?.gt(DEFAULT_VALUE) || item.yourEarned?.gt(DEFAULT_VALUE));

    // TODO: Rename StableFarmFormTabs to StableDividendsFromTabs after merge QUIPU-225
    const link = `${AppRootRoutes.Stableswap}${StableswapRoutes.farming}/${StableFarmFormTabs.stake}/${item.stableFarmItemUrl}`;
    const status = { status: ActiveStatus.ACTIVE, label: t('common|whiteListed'), filled: true };
    const extractedTokens = extractTokens(item.tokensInfo);

    const stableDividendsItemDTI = `stable-dividends-item-${item.id}`;

    const itemStats = [
      {
        cellName: t('stableswap|tvl'),
        amounts: {
          amount: item.tvl,
          dollarEquivalent: item.tvl,
          currency: DOLLAR,
          dollarEquivalentOnly: true
        }
      },
      {
        cellName: t('stableswap|apr'),
        amounts: {
          amount: item.apr,
          currency: PERCENT,
          amountDecimals: 2
        }
      },
      {
        cellName: t('stableswap|apy'),
        amounts: {
          amount: item.apy,
          currency: PERCENT,
          amountDecimals: 2
        }
      }
    ];

    const userStats = shouldShowUserStats
      ? [
          {
            cellName: t('stableswap|yourDeposit'),
            amounts: {
              amount: item.yourDeposit,
              dollarEquivalent: item.yourDeposit.multipliedBy(item.stakedTokenExchangeRate),
              dollarEquivalentOnly: true
            }
          },
          {
            cellName: t('stableswap|yourEarned'),
            amounts: {
              amount: item.yourEarned,
              dollarEquivalent: item.yourEarned.multipliedBy(item.stakedTokenExchangeRate),
              dollarEquivalentOnly: true
            }
          }
        ]
      : undefined;

    return {
      href: link,
      status: status,
      inputToken: extractedTokens,
      outputToken: item.stakedToken,
      itemStats,
      userStats,
      stableDividendsItemDTI
    };
  });

  return { title, isLoading, data: data ?? [] };
};
