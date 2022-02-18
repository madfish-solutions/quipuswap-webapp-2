import { AuthStore } from './auth.store';
import { StakingStore } from './staking.store';
import { UiStore } from './ui.store';

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
