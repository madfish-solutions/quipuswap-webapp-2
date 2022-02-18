import { StakingStore } from './StakingStore';

export class RootStore {
  stakingStore: StakingStore;

  constructor() {
    this.stakingStore = new StakingStore(this);
  }
}
