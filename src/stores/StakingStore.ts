import { Nullable } from '@quipuswap/ui-kit';
import { action, makeObservable, observable } from 'mobx';

import { StakeItem } from '@api/staking';
import { getStakesList } from '@api/staking/getStakesList';

import { RootStore } from './RootStore';

export class StakingStore {
  root: RootStore;
  rawList: StakeItem[] = [];
  isLoading = false;
  error: Nullable<Error> = null;

  constructor(root: RootStore) {
    this.root = root;
    makeObservable(this, {
      loadList: action,
      rawList: observable,
      isLoading: observable,
      error: observable
    });
  }

  async loadList() {
    this.isLoading = true;
    try {
      this.rawList = await getStakesList();
      this.error = null;
    } catch (error) {
      this.error = error as Error;
      this.rawList = [];
    }
    this.isLoading = false;
  }
}
