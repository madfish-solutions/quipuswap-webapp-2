import { Nullable } from '@quipuswap/ui-kit';
import { makeAutoObservable } from 'mobx';

import { getStakesList } from '@api/staking/getStakesList';
import { getStakesStats } from '@api/staking/getStakesStats';
import { RawStakeStats, StakeStats } from '@interfaces/staking';
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

  makeStakingObservable = (stakingId: string) => {
    return makeAutoObservable({
      value: this.list,
      get staking() {
        return this.value.data.find(({ id }) => id === stakingId);
      }
    });
  };

  get listIsInitialized() {
    return this.list.isInitialized;
  }

  get listIsLoading() {
    return this.list.isLoading;
  }

  get listError() {
    return this.list.error;
  }
}
