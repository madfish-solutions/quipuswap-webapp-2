import { FC } from 'react';

import { StakingRewards } from '@components/common/staking-rewards';

import { StakeList } from './list';

export const Stake: FC = () => {
  return (
    <>
      <StakingRewards />
      <StakeList />
    </>
  );
};
