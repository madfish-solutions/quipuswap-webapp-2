import BigNumber from 'bignumber.js';

import { StakeFormValues } from '@utils/types';

import { StakingTabs } from '../types';

interface SubmitProps {
  values: StakeFormValues;
  stakingId: BigNumber;
  tab: StakingTabs;
}

export const unstake = (stakingId: BigNumber) => {
  // eslint-disable-next-line no-console
  console.log(`TODO: Unstake from staking ${stakingId}`);
};

export const submitForm = ({ tab, stakingId }: SubmitProps) => {
  // eslint-disable-next-line no-console
  console.log(`TODO: make operation ${tab} for staking ${stakingId}`);
};
