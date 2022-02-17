import { FC, useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { Slider } from '@components/ui/slider';
import { TopStats } from '@components/ui/top-stats';
import { useStakingStore } from '@hooks/stores/use-staking-store';
import { useToasts } from '@hooks/use-toasts';

import styles from './list-stats.module.scss';

export const ListStats: FC = observer(() => {
  const { showErrorToast } = useToasts();
  const stakingStore = useStakingStore();

  /*
    Load data
   */
  useEffect(() => {
    void stakingStore.stats.load();
  }, [stakingStore]);

  /*
    Handle errors
   */
  useEffect(() => {
    if (stakingStore.stats.error?.message) {
      showErrorToast(stakingStore.stats.error?.message);
    }
  }, [showErrorToast, stakingStore.stats.error]);

  const amount = stakingStore.stats.data;

  const stats = [
    {
      title: 'Total Value  Locked',
      amount: amount?.totalValueLocked
    },
    {
      title: 'Total Daily Reward',
      amount: amount?.totalDailyReward
    },
    {
      title: 'Total Pending Reward',
      amount: amount?.totalPendingReward
    },
    {
      title: 'Total Claimed Reward',
      amount: amount?.totalClaimedReward
    }
  ];

  return (
    <div className={styles.listStats}>
      <Slider>
        {stats.map(({ title, amount }) => (
          <TopStats title={title} amount={amount} key={title} />
        ))}
      </Slider>
    </div>
  );
});
