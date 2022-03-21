import { useTranslation } from 'next-i18next';

import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { StakeListStatsDTA } from '@tests/staking/list';

export const useListStatsViewModel = () => {
  const { t } = useTranslation(['farm']);
  const stakingStore = useStakingListStore();

  const amount = stakingStore.statsStore.data;

  const stats = [
    {
      title: t('farm|totalValueLocked'),
      tooltip: t('farm|totalValueLockedTooltip'),
      amount: amount?.totalValueLocked,
      testId: StakeListStatsDTA.TOTAL_VALUE_LOCKED
    },
    {
      title: t('farm|totalDailyReward'),
      tooltip: t('farm|totalDailyRewardTooltip'),
      amount: amount?.totalDailyReward,
      testId: StakeListStatsDTA.TOTAL_DAILY_REWARD
    },
    {
      title: t('farm|totalPendingReward'),
      tooltip: t('farm|totalPendingRewardTooltip'),
      amount: amount?.totalPendingReward,
      testId: StakeListStatsDTA.TOTAL_PENDING_REWARD
    },
    {
      title: t('farm|totalClaimedReward'),
      tooltip: t('farm|totalClaimedRewardTooltip'),
      amount: amount?.totalClaimedReward,
      testId: StakeListStatsDTA.TOTAL_CLAIMED_REWARD
    }
  ];

  return {
    stats
  };
};
