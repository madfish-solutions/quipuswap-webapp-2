import { useEffect } from 'react';

import { PERCENT } from '@config/constants';
import { useFarmingListStore } from '@modules/farming/hooks';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useReady } from '@providers/use-dapp';
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

  const data2 =
    list?.map(item => ({
      href: `${item.id}`,
      status: { status: item.stakeStatus, filled: true },
      inputToken: item.tokens,
      outputToken: item.rewardToken,
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
      ]
    })) ?? [];

  return {
    isLoading,
    list: data2 ?? [],
    title
  };
};
