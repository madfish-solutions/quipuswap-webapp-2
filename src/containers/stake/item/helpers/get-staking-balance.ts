import { Nullable } from '@utils/types';

export interface StakeBalances {
  availableStakeBalance: Nullable<string>;
  availableUnstakeBalance: Nullable<string>;
}

export const getStakeBalances = (): StakeBalances => {
  return {
    availableStakeBalance: '1',
    availableUnstakeBalance: '1'
  };
};
