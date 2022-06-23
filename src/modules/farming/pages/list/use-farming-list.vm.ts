import { useEffect } from 'react';

import { NEW_FARMINGS } from '@config/config';
import { PERCENT } from '@config/constants';
import { useFarmingListStore } from '@modules/farming/hooks';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useReady } from '@providers/use-dapp';
import { getTokenSymbol, isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useTranslation } from '@translation';

export const useFarmingListViewModel = () => {
  const { accountPkh } = useAuthStore();
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

  const data2 = list?.map(item => ({
    href: `${item.id}`,
    status: { status: item.stakeStatus, filled: true },
    inputToken: item.tokens,
    outputToken: item.rewardToken,
    isNew: NEW_FARMINGS.includes(item.id.toFixed()),
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
    userStats: isNull(accountPkh)
      ? undefined
      : [
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
