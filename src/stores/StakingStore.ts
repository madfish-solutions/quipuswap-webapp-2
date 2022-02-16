import { Nullable } from '@quipuswap/ui-kit';

import { StakeStats } from '@api/staking';
import { getStakesList } from '@api/staking/getStakesList';
import { getStakesStats } from '@api/staking/getStakesStats';

import { LoadingErrorData } from './LoadingErrorData';
import { RootStore } from './RootStore';

export class StakingStore {
  root: RootStore;

  list = new LoadingErrorData(getStakesList, []);
  stats = new LoadingErrorData<Nullable<StakeStats>>(getStakesStats, null);

  constructor(root: RootStore) {
    this.root = root;
  }
}
