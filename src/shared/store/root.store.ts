import { TezosToolkit } from '@taquito/taquito';
import { action, makeObservable, observable } from 'mobx';

import { CoinflipStore as ICoinflipStore } from '@modules/coinflip';
import {
  FarmingFilterStore as IFarmingFilterStore,
  FarmingItemStore as IFarmingItemStore,
  FarmingListStore as IFarmingListStore
} from '@modules/farming/store';
import {
  StableswapFilterStore as IStableswapFilterStore,
  StableswapItemStore as IStableswapItemStore,
  StableswapItemFormStore as IStableswapItemFormStore,
  StableswapListStore as IStableswapListStore
} from '@modules/stableswap/store';

import { isExist, isNull } from '../helpers';
import { Nullable } from '../types';
import { AuthStore } from './auth.store';
import { SettingsStore } from './settings.store';
import { TokensBalancesStore } from './tokens-balances.store';
import { TokensStore } from './tokens.store';
import { UiStore } from './ui.store';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  settingsStore: SettingsStore;
  tokensBalancesStore: TokensBalancesStore;
  tokensStore: TokensStore;

  farmingListStore: Nullable<IFarmingListStore> = null;
  farmingFilterStore: Nullable<IFarmingFilterStore> = null;
  farmingItemStore: Nullable<IFarmingItemStore> = null;

  stableswapListStore: Nullable<IStableswapListStore> = null;
  stableswapItemStore: Nullable<IStableswapItemStore> = null;
  stableswapItemFormStore: Nullable<IStableswapItemFormStore> = null;
  stableswapFilterStore: Nullable<IStableswapFilterStore> = null;

  coinflipStore: Nullable<ICoinflipStore> = null;

  tezos: Nullable<TezosToolkit> = null;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.settingsStore = new SettingsStore(this);
    this.tokensBalancesStore = new TokensBalancesStore(this);
    this.tokensStore = new TokensStore(this);

    makeObservable(this, {
      tezos: observable,

      farmingListStore: observable,
      farmingFilterStore: observable,
      farmingItemStore: observable,
      coinflipStore: observable,

      setTezos: action,
      createFarmingListStore: action,
      createFarmingFilterStore: action,
      createFarmingItemStore: action,
      createCoinflipStore: action
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

  async createStableswapItemFormStore() {
    if (isNull(this.stableswapItemFormStore)) {
      const { StableswapItemFormStore } = await import('@modules/stableswap/store/stableswap-item-form.store');
      this.stableswapItemFormStore = new StableswapItemFormStore(this);
    }
  }

  async createStableswapFilterStore() {
    if (isNull(this.stableswapFilterStore)) {
      const { StableswapFilterStore } = await import('@modules/stableswap/store/stableswap-filter.store');
      this.stableswapFilterStore = new StableswapFilterStore();
    }
  }

  async createFarmingFilterStore() {
    if (isNull(this.farmingFilterStore)) {
      const { FarmingFilterStore } = await import('@modules/farming/store/farming-filter.store');
      this.farmingFilterStore = new FarmingFilterStore();
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

  async createCoinflipStore() {
    if (isExist(this.coinflipStore)) {
      return;
    }
    const { CoinflipStore } = await import('@modules/coinflip');
    this.coinflipStore = new CoinflipStore(this);
  }
}
