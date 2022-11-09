import { useFarmingListStatsStore } from '@modules/farming/hooks';
import { FarmingListStatsDTA } from '@tests/farming';
import { useTranslation } from '@translation';

export const useListStatsViewModel = () => {
  const { t } = useTranslation(['farm']);
  const { stats: amounts } = useFarmingListStatsStore();

  const stats = [
    {
      title: t('farm|totalValueLocked'),
      tooltip: t('farm|totalValueLockedTooltip'),
      amount: amounts?.totalValueLocked,
      testId: FarmingListStatsDTA.TOTAL_VALUE_LOCKED
    },
    {
      title: t('farm|totalDailyReward'),
      tooltip: t('farm|totalDailyRewardTooltip'),
      amount: amounts?.totalDailyReward,
      testId: FarmingListStatsDTA.TOTAL_DAILY_REWARD
    },
    {
      title: t('farm|totalPendingReward'),
      tooltip: t('farm|totalPendingRewardTooltip'),
      amount: amounts?.totalPendingReward,
      testId: FarmingListStatsDTA.TOTAL_PENDING_REWARD
    },
    {
      title: t('farm|maxApr'),
      tooltip: t('farm|totalClaimedRewardTooltip'),
      amount: amounts?.maxApr,
      testId: FarmingListStatsDTA.MAX_APR,
      currency: '%'
    }
  ];

  return {
    stats
  };
};
