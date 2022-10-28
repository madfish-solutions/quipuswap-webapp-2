import { TezosToolkit } from '@taquito/taquito';
import { action, makeObservable, observable } from 'mobx';

import { CoinflipStore as ICoinflipStore } from '@modules/coinflip';
import {
  FarmingFilterStore as IFarmingFilterStore,
  FarmingItemStore as IFarmingItemStore,
  FarmingListStore as IFarmingListStore,
  FarmingListCommonStore as IFarmingListCommonStore,
  FarmingYouvesItemStore as IFarmingYouvesItemStore,
  HarvestAndRollStore as IHarvestAndRollStore
} from '@modules/farming/store';
import {
  NewLiquidityListStore as INewLiquidityListStore,
  NewLiquidityItemStore as INewLiquidityItemStore,
  LiquidityListFiltersStore as ILiquidityListFiltersStore
} from '@modules/new-liquidity';
import {
  StableswapFilterStore as IStableswapFilterStore,
  StableswapItemStore as IStableswapItemStore,
  StableswapItemFormStore as IStableswapItemFormStore,
  StableswapListStore as IStableswapListStore,
  StableDividendsListStore as IStableDividendsListStore,
  StableDividendsFilterStore as IStableDividendsFilterStore,
  StableDividendsItemStore as IStableDividendsItemStore
} from '@modules/stableswap/store';
import { TokensModalStore } from '@shared/modals/tokens-modal/tokens-modal.store';

import { isExist, isNull } from '../helpers';
import { Nullable } from '../types';
import { AuthStore } from './auth.store';
import { SettingsStore } from './settings.store';
import { TokensBalancesStore } from './tokens-balances.store';
import { TokensManagerStore } from './tokens-manager.store';
import { TokensStore } from './tokens.store';
import { UiStore } from './ui.store';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  settingsStore: SettingsStore;
  tokensBalancesStore: TokensBalancesStore;
  tokensStore: TokensStore;
  tokensManagerStore: TokensManagerStore;
  tokensModalStore: TokensModalStore;

  farmingListStore: Nullable<IFarmingListStore> = null;
  farmingListCommonStore: Nullable<IFarmingListCommonStore> = null;
  farmingFilterStore: Nullable<IFarmingFilterStore> = null;
  farmingItemStore: Nullable<IFarmingItemStore> = null;
  farmingYouvesItemStore: Nullable<IFarmingYouvesItemStore> = null;
  harvestAndRollStore: Nullable<IHarvestAndRollStore> = null;

  stableswapListStore: Nullable<IStableswapListStore> = null;
  stableswapItemStore: Nullable<IStableswapItemStore> = null;
  stableswapItemFormStore: Nullable<IStableswapItemFormStore> = null;
  stableswapFilterStore: Nullable<IStableswapFilterStore> = null;

  stableDividendsListStore: Nullable<IStableDividendsListStore> = null;
  stableDividendsFilterStore: Nullable<IStableDividendsFilterStore> = null;
  stableDividendsItemStore: Nullable<IStableDividendsItemStore> = null;

  newLiquidityListStore: Nullable<INewLiquidityListStore> = null;
  newLiquidityItemStore: Nullable<INewLiquidityItemStore> = null;
  liquidityListFiltersStore: Nullable<ILiquidityListFiltersStore> = null;

  coinflipStore: Nullable<ICoinflipStore> = null;

  tezos: Nullable<TezosToolkit> = null;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.settingsStore = new SettingsStore(this);
    this.tokensBalancesStore = new TokensBalancesStore(this);
    this.tokensStore = new TokensStore(this);
    this.tokensManagerStore = new TokensManagerStore(this);
    this.tokensModalStore = new TokensModalStore(this);

    makeObservable(this, {
      tezos: observable,

      farmingListStore: observable,
      farmingFilterStore: observable,
      farmingItemStore: observable,

      stableswapListStore: observable,
      farmingListCommonStore: observable,
      stableswapItemStore: observable,
      stableswapItemFormStore: observable,
      stableswapFilterStore: observable,

      stableDividendsListStore: observable,
      stableDividendsFilterStore: observable,
      stableDividendsItemStore: observable,

      newLiquidityListStore: observable,
      newLiquidityItemStore: observable,

      coinflipStore: observable,

      setTezos: action,
      createFarmingListStore: action,
      createFarmingListCommonStore: action,
      createFarmingFilterStore: action,
      createFarmingItemStore: action,
      createCoinflipStore: action,

      createStableswapListStore: action,
      createStableswapItemStore: action,
      createStableswapItemFormStore: action,
      createStableswapFilterStore: action,

      createStableDividendsListStore: action,
      createStableDividendsFilterStore: action,
      createStableDividendsItemStore: action,

      createNewLiquidityListStore: action,
      createNewLiquidityItemStore: action,
      createLiquidityListFiltersStore: action
    });
  }

  setTezos(tezos: Nullable<TezosToolkit>) {
    this.tezos = tezos;
  }

  async createNewLiquidityListStore() {
    if (isNull(this.newLiquidityListStore)) {
      const { NewLiquidityListStore } = await import('@modules/new-liquidity/store/new-liquidity-list.store');
      this.newLiquidityListStore = new NewLiquidityListStore(this);
    }
  }

  async createLiquidityListFiltersStore() {
    if (isNull(this.liquidityListFiltersStore)) {
      const { LiquidityListFiltersStore } = await import('@modules/new-liquidity/store/liquidity-list-filters.stores');
      this.liquidityListFiltersStore = new LiquidityListFiltersStore();
    }
  }

  async createNewLiquidityItemStore() {
    if (isNull(this.newLiquidityItemStore)) {
      const { NewLiquidityItemStore } = await import('@modules/new-liquidity/store/new-liquidity-item.store');
      this.newLiquidityItemStore = new NewLiquidityItemStore(this);
    }
  }

  async createStableDividendsListStore() {
    if (isNull(this.stableDividendsListStore)) {
      const { StableDividendsListStore } = await import('@modules/stableswap/store/stabledividends-list.store');
      this.stableDividendsListStore = new StableDividendsListStore(this);
    }
  }

  async createStableDividendsItemStore() {
    if (isNull(this.stableDividendsItemStore)) {
      const { StableDividendsItemStore } = await import('@modules/stableswap/store/stabledividends-item.store');
      this.stableDividendsItemStore = new StableDividendsItemStore(this);
    }
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

  async createStableDividendsFilterStore() {
    if (isNull(this.stableDividendsFilterStore)) {
      const { StableDividendsFilterStore } = await import('@modules/stableswap/store/stabledividends-filter.store');
      this.stableDividendsFilterStore = new StableDividendsFilterStore();
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

  async createFarmingListCommonStore() {
    if (isNull(this.farmingListCommonStore)) {
      const { FarmingListCommonStore } = await import('@modules/farming/store/farming-list-common.store');
      this.farmingListCommonStore = new FarmingListCommonStore(this);
    }
  }

  async createHarvestAndRollStore() {
    if (isNull(this.harvestAndRollStore)) {
      const { HarvestAndRollStore } = await import('@modules/farming/store/harvest-and-roll.store');
      this.harvestAndRollStore = new HarvestAndRollStore(this);
    }
  }

  async createFarmingItemStore() {
    if (isNull(this.farmingItemStore)) {
      const { FarmingItemStore } = await import('@modules/farming/store/farming-item.store');
      this.farmingItemStore = new FarmingItemStore(this);
    }
  }

  async createFarmingYouvesItemStore() {
    if (isNull(this.farmingYouvesItemStore)) {
      const { FarmingYouvesItemStore } = await import('@modules/farming/store/farming-youves-item.store');
      this.farmingYouvesItemStore = new FarmingYouvesItemStore(this);
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
