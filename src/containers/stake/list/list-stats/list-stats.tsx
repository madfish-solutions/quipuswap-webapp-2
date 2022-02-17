import { FC, useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { Slider } from '@components/ui/slider';
import { TopStats } from '@components/ui/top-stats';
import { useStakingStore } from '@hooks/stores/use-staking-store';
import { useToasts } from '@hooks/use-toasts';
import { bigNumberToString } from '@utils/helpers/big-number-to-string';

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

  const totalValueLocked = stakingStore.stats.data?.totalValueLocked
    ? bigNumberToString(stakingStore.stats.data?.totalValueLocked)
    : '?';

  const totalDailyReward = stakingStore.stats.data?.totalDailyReward
    ? bigNumberToString(stakingStore.stats.data?.totalDailyReward)
    : '?';

  const totalPendingReward = stakingStore.stats.data?.totalPendingReward
    ? bigNumberToString(stakingStore.stats.data?.totalPendingReward)
    : '?';

  const totalClaimedReward = stakingStore.stats.data?.totalClaimedReward
    ? bigNumberToString(stakingStore.stats.data?.totalClaimedReward)
    : '?';

  return (
    <div style={{ marginBottom: 32 }}>
      <Slider>
        <TopStats title="Total Value  Locked" amount={totalValueLocked} />
        <TopStats title="Total Daily Reward" amount={totalDailyReward} />
        <TopStats title="Total Pending Reward" amount={totalPendingReward} />
        <TopStats title="Total Claimed Reward" amount={totalClaimedReward} />
      </Slider>
    </div>
  );
});
