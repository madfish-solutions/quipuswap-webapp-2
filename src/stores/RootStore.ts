import { AuthStore } from './AuthStore';
import { StakingStore } from './StakingStore';
import { UiStore } from './UiStore';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  stakingStore: StakingStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.stakingStore = new StakingStore(this);
  }
}
