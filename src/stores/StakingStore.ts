import { Nullable } from '@quipuswap/ui-kit';

import { RawStakeStats, StakeStats } from '@api/staking';
import { getStakesList } from '@api/staking/getStakesList';
import { getStakesStats } from '@api/staking/getStakesStats';
import { mapStakesItems, mapStakeStats } from '@utils/mapping/staking';

import { LoadingErrorData } from './LoadingErrorData';
import { RootStore } from './RootStore';

export class StakingStore {
  root: RootStore;

  list = new LoadingErrorData([], getStakesList, mapStakesItems);
  stats = new LoadingErrorData<RawStakeStats, Nullable<StakeStats>>(null, getStakesStats, mapStakeStats);

  constructor(root: RootStore) {
    this.root = root;
  }
}
