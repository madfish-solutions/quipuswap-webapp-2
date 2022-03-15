import { useTranslation } from 'next-i18next';

import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { StakeListStatsDTA } from '@tests/staking/list';

export const useListStatsViewModel = () => {
  const { t } = useTranslation(['stake']);
  const stakingStore = useStakingListStore();

  const amount = stakingStore.statsStore.data;

  const stats = [
    {
      title: t('stake|totalValueLocked'),
      tooltip: t('stake|totalValueLockedTooltip'),
      amount: amount?.totalValueLocked,
      testId: StakeListStatsDTA.TOTAL_VALUE_LOCKED
    },
    {
      title: t('stake|totalDailyReward'),
      tooltip: t('stake|totalDailyRewardTooltip'),
      amount: amount?.totalDailyReward,
      testId: StakeListStatsDTA.TOTAL_DAILY_REWARD
    },
    {
      title: t('stake|totalPendingReward'),
      tooltip: t('stake|totalPendingRewardTooltip'),
      amount: amount?.totalPendingReward,
      testId: StakeListStatsDTA.TOTAL_PENDING_REWARD
    },
    {
      title: t('stake|totalClaimedReward'),
      tooltip: t('stake|totalClaimedRewardTooltip'),
      amount: amount?.totalClaimedReward,
      testId: StakeListStatsDTA.TOTAL_CLAIMED_REWARD
    }
  ];

  return {
    stats
  };
};
