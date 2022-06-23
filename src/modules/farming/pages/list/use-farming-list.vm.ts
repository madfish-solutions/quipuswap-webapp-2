import { useEffect } from 'react';

import { PERCENT } from '@config/constants';
import { useFarmingListStore } from '@modules/farming/hooks';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useReady } from '@providers/use-dapp';
import { getTokenSymbol } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useFarmingListViewModel = () => {
  const farmingListStore = useFarmingListStore();
  const isReady = useReady();
  const { getFarmingList } = useGetFarmingList();
  const { getFarmingStats } = useGetFarmingStats();

  const { t } = useTranslation();
  const title = t('common|Farming');

  /*
    Load data
  */
  useEffect(() => {
    if (isReady) {
      void getFarmingList();
      void getFarmingStats();
    }
  }, [getFarmingList, getFarmingStats, isReady]);

  const { listStore, list } = farmingListStore;
  const { isLoading } = listStore;

  // eslint-disable-next-line no-console
  console.log('list', list);

  const data2 = list?.map(item => ({
    href: `${item.id}`,
    status: { status: item.stakeStatus, filled: true },
    inputToken: item.tokens,
    outputToken: item.rewardToken,
    isNew: item.id.eq('16') || item.id.eq('17') || item.id.eq('18'),
    itemStats: [
      {
        cellName: t('farm|tvl'),
        amounts: {
          amount: item.tvlInStakedToken,
          dollarEquivalent: item.tvlInUsd,
          currency: item.stakedToken.metadata.symbol,
          dollarEquivalentOnly: true
        }
      },
      {
        cellName: t('farm|apr'),
        amounts: {
          amount: item.apr,
          currency: PERCENT,
          amountDecimals: 2
        }
      },
      {
        cellName: t('farm|apy'),
        amounts: {
          amount: item.apy,
          currency: PERCENT,
          amountDecimals: 2
        }
      }
    ],
    userStats: [
      {
        cellName: t('farm|yourDeposit'),
        amounts: {
          amount: item.depositBalance,
          dollarEquivalent: item.depositBalance?.multipliedBy(item.depositExchangeRate ?? '0'),
          currency: getTokenSymbol(item.stakedToken),
          dollarEquivalentOnly: true
        }
      },
      {
        cellName: t('farm|yourEarned'),
        amounts: {
          amount: item.earnBalance,
          dollarEquivalent: item.earnBalance?.multipliedBy(item.earnExchangeRate ?? '0'),
          currency: getTokenSymbol(item.rewardToken),
          dollarEquivalentOnly: true
        }
      }
    ]
  }));

  return {
    isLoading,
    list: data2 ?? [],
    title
  };
};
