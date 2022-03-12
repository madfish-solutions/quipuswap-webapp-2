import { useTranslation } from 'next-i18next';

import { useStakingListStore } from '@hooks/stores/use-staking-list-store';

export const useListStatsViewModel = () => {
  const { t } = useTranslation(['stake']);
  const stakingStore = useStakingListStore();

  const amount = stakingStore.statsStore.data;

  const stats = [
    {
      title: t('stake|totalValueLocked'),
      tooltip: t('stake|totalValueLockedTooltip'),
      amount: amount?.totalValueLocked,
      testId: 'totalValueLocked'
    },
    {
      title: t('stake|totalDailyReward'),
      tooltip: t('stake|totalDailyRewardTooltip'),
      amount: amount?.totalDailyReward,
      testId: 'totalDailyReward'
    },
    {
      title: t('stake|totalPendingReward'),
      tooltip: t('stake|totalPendingRewardTooltip'),
      amount: amount?.totalPendingReward,
      testId: 'totalPendingReward'
    },
    {
      title: t('stake|totalClaimedReward'),
      tooltip: t('stake|totalClaimedRewardTooltip'),
      amount: amount?.totalClaimedReward,
      testId: 'totalClaimedReward'
    }
  ];

  return {
    stats
  };
};
