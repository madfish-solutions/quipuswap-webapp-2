import { makeObservable } from 'mobx';

import { Nullable } from '../types/types';
import { FarmingStore } from './farming.store';

export class RootStore {
  farmingStore: Nullable<FarmingStore> = null;

  constructor() {
    makeObservable(this);
  }

  async createFarmingStore() {
    const { FarmingStore } = await import('./farming.store');
    this.farmingStore = new FarmingStore(this);
  }
}
