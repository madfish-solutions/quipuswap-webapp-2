import { useTranslation } from 'next-i18next';

import { useFarmingListStore } from '@modules/farming/hooks';
import { FarmingListStatsDTA } from 'tests/farming/list';

export const useListStatsViewModel = () => {
  const { t } = useTranslation(['farm']);
  const farmingStore = useFarmingListStore();

  const amount = farmingStore!.statsStore.data;

  const stats = [
    {
      title: t('farm|totalValueLocked'),
      tooltip: t('farm|totalValueLockedTooltip'),
      amount: amount?.totalValueLocked,
      testId: FarmingListStatsDTA.TOTAL_VALUE_LOCKED
    },
    {
      title: t('farm|totalDailyReward'),
      tooltip: t('farm|totalDailyRewardTooltip'),
      amount: amount?.totalDailyReward,
      testId: FarmingListStatsDTA.TOTAL_DAILY_REWARD
    },
    {
      title: t('farm|totalPendingReward'),
      tooltip: t('farm|totalPendingRewardTooltip'),
      amount: amount?.totalPendingReward,
      testId: FarmingListStatsDTA.TOTAL_PENDING_REWARD
    },
    {
      title: t('farm|totalClaimedReward'),
      tooltip: t('farm|totalClaimedRewardTooltip'),
      amount: amount?.totalClaimedReward,
      testId: FarmingListStatsDTA.TOTAL_CLAIMED_REWARD
    }
  ];

  return {
    stats
  };
};
