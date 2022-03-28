import { TezosToolkit } from '@taquito/taquito';
import { action, makeObservable, observable } from 'mobx';

import { Nullable } from '../../types/types';
import { isNull } from '../helpers';
import { AuthStore } from './auth.store';
import { FarmingFilterStore as IFarmingFilterStore } from './farming-filter.store';
import { FarmingItemStore as IFarmingItemStore } from './farming-item.store';
import { FarmingListStore as IFarmingListStore } from './farming-list.store';
import { UiStore } from './ui.store';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;

  farmingListStore: Nullable<IFarmingListStore> = null;
  farmingFilterStore: Nullable<IFarmingFilterStore> = null;
  farmingItemStore: Nullable<IFarmingItemStore> = null;

  tezos: Nullable<TezosToolkit> = null;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);

    makeObservable(this, {
      tezos: observable,
      authStore: observable,
      uiStore: observable,
      farmingListStore: observable,
      farmingFilterStore: observable,
      farmingItemStore: observable,
      setTezos: action,
      createFarmingListStore: action,
      createFarmingFilterStore: action,
      createFarmingItemStore: action
    });
  }

  setTezos(tezos: Nullable<TezosToolkit>) {
    this.tezos = tezos;
  }

  async createFarmingFilterStore() {
    if (isNull(this.farmingFilterStore)) {
      const { FarmingFilterStore } = await import('./farming-filter.store');
      this.farmingFilterStore = new FarmingFilterStore(this);
    }
  }

  async createFarmingListStore() {
    if (isNull(this.farmingListStore)) {
      const { FarmingListStore } = await import('./farming-list.store');
      this.farmingListStore = new FarmingListStore(this);
    }
  }

  async createFarmingItemStore() {
    if (isNull(this.farmingItemStore)) {
      const { FarmingItemStore } = await import('./farming-item.store');
      this.farmingItemStore = new FarmingItemStore(this);
    }
  }
}
