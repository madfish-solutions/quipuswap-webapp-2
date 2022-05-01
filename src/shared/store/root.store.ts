import { TezosToolkit } from '@taquito/taquito';
import { action, makeObservable, observable } from 'mobx';

import {
  FarmingFilterStore as IFarmingFilterStore,
  FarmingItemStore as IFarmingItemStore,
  FarmingListStore as IFarmingListStore
} from '@modules/farming/store';
import {
  StableswapListStore as IStableswapListStore,
  StableswapItemStore as IStableswapItemStore,
  StableswapFilterStore as IStableswapFilterStore
} from '@modules/stableswap/store';

import { isNull } from '../helpers';
import { Nullable } from '../types/types';
import { AuthStore } from './auth.store';
import { SettingsStore } from './settings.store';
import { UiStore } from './ui.store';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  settingsStore: SettingsStore;

  farmingListStore: Nullable<IFarmingListStore> = null;
  farmingFilterStore: Nullable<IFarmingFilterStore> = null;
  farmingItemStore: Nullable<IFarmingItemStore> = null;

  stableswapListStore: Nullable<IStableswapListStore> = null;
  stableswapItemStore: Nullable<IStableswapItemStore> = null;
  stableswapFilterStore: Nullable<IStableswapFilterStore> = null;

  tezos: Nullable<TezosToolkit> = null;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.settingsStore = new SettingsStore(this);

    makeObservable(this, {
      tezos: observable,
      authStore: observable,
      uiStore: observable,
      settingsStore: observable,
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
  async createStableswapListStore() {
    if (isNull(this.stableswapListStore)) {
      const { StableswapListStore } = await import('@modules/stableswap/store/stableswap-list.store');
      this.stableswapListStore = new StableswapListStore(this);
    }
  }

  async createStableswapItemStore() {
    if (isNull(this.stableswapItemStore)) {
      const { StableswapItemStore } = await import('@modules/stableswap/store/stableswap-item.store');
      this.stableswapItemStore = new StableswapItemStore(this);
    }
  }

  async createStableswapFilterStore() {
    if (isNull(this.stableswapFilterStore)) {
      const { StableswapFilterStore } = await import('@modules/stableswap/store/stableswap-filter.store');
      this.stableswapFilterStore = new StableswapFilterStore(this);
    }
  }

  async createFarmingFilterStore() {
    if (isNull(this.farmingFilterStore)) {
      const { FarmingFilterStore } = await import('@modules/farming/store/farming-filter.store');
      this.farmingFilterStore = new FarmingFilterStore(this);
    }
  }

  async createFarmingListStore() {
    if (isNull(this.farmingListStore)) {
      const { FarmingListStore } = await import('@modules/farming/store/farming-list.store');
      this.farmingListStore = new FarmingListStore(this);
    }
  }

  async createFarmingItemStore() {
    if (isNull(this.farmingItemStore)) {
      const { FarmingItemStore } = await import('@modules/farming/store/farming-item.store');
      this.farmingItemStore = new FarmingItemStore(this);
    }
  }
}
