import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { noop } from 'rxjs';

import { useStakingListStore } from '@hooks/stores/use-staking-list-store';

import { RewardInfo } from '../reward-info';

export const StakingRewardsList: FC = observer(() => {
  const stakingListStore = useStakingListStore();

  return (
    <RewardInfo amount={stakingListStore.pendingRewards} onButtonClick={noop} buttonText="Harvest All" currency="$" />
  );
});
