import { TezosToolkit } from '@taquito/taquito';
import { action, makeObservable, observable } from 'mobx';

import { CoinflipStore as ICoinflipStore } from '@modules/coinflip';
import {
  FarmingFilterStore as IFarmingFilterStore,
  FarmingItemStore as IFarmingItemStore,
  FarmingListStatsStore as IFarmingListStatsStore,
  FarmingListStore as IFarmingListStore,
  FarmingYouvesItemStore as IFarmingYouvesItemStore,
  HarvestAndRollStore as IHarvestAndRollStore
} from '@modules/farming/store';
import {
  LiquidityListStore as ILiquidityListStore,
  LiquidityItemStore as ILiquidityItemStore,
  LiquidityListFiltersStore as ILiquidityListFiltersStore,
  LiquidityV3PoolStore as ILiquidityV3PoolStore,
  LiquidityV3PositionStore as ILiquidityV3PositionStore,
  LiquidityV3PositionsStore as ILiquidityV3PositionsStore
} from '@modules/liquidity';
import {
  StableswapItemStore as IStableswapItemStore,
  StableswapItemFormStore as IStableswapItemFormStore,
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
  farmingListStatsStore: Nullable<IFarmingListStatsStore> = null;
  farmingFilterStore: Nullable<IFarmingFilterStore> = null;
  farmingItemStore: Nullable<IFarmingItemStore> = null;
  farmingYouvesItemStore: Nullable<IFarmingYouvesItemStore> = null;
  harvestAndRollStore: Nullable<IHarvestAndRollStore> = null;

  stableswapItemStore: Nullable<IStableswapItemStore> = null;
  stableswapItemFormStore: Nullable<IStableswapItemFormStore> = null;

  stableDividendsListStore: Nullable<IStableDividendsListStore> = null;
  stableDividendsFilterStore: Nullable<IStableDividendsFilterStore> = null;
  stableDividendsItemStore: Nullable<IStableDividendsItemStore> = null;

  liquidityListStore: Nullable<ILiquidityListStore> = null;
  liquidityItemStore: Nullable<ILiquidityItemStore> = null;
  liquidityV3PoolStore: Nullable<ILiquidityV3PoolStore> = null;
  liquidityV3PositionStore: Nullable<ILiquidityV3PositionStore> = null;
  liquidityV3PositionsStore: Nullable<ILiquidityV3PositionsStore> = null;
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

      farmingListStatsStore: observable,
      farmingFilterStore: observable,
      farmingItemStore: observable,

      farmingListStore: observable,
      stableswapItemStore: observable,
      stableswapItemFormStore: observable,

      stableDividendsListStore: observable,
      stableDividendsFilterStore: observable,
      stableDividendsItemStore: observable,

      liquidityListStore: observable,
      liquidityItemStore: observable,

      coinflipStore: observable,

      setTezos: action,
      createFarmingListStatsStore: action,
      createFarmingListStore: action,
      createFarmingFilterStore: action,
      createFarmingItemStore: action,
      createCoinflipStore: action,

      createStableswapItemStore: action,
      createStableswapItemFormStore: action,

      createStableDividendsListStore: action,
      createStableDividendsFilterStore: action,
      createStableDividendsItemStore: action,

      createLiquidityListStore: action,
      createLiquidityItemStore: action,
      createLiquidityV3PoolStore: action,
      createLiquidityV3PositionStore: action,
      createLiquidityV3PositionsStore: action,
      createLiquidityListFiltersStore: action
    });
  }

  setTezos(tezos: Nullable<TezosToolkit>) {
    this.tezos = tezos;
  }

  async createLiquidityListStore() {
    if (isNull(this.liquidityListStore)) {
      const { LiquidityListStore } = await import('@modules/liquidity/store/liquidity-list.store');
      this.liquidityListStore = new LiquidityListStore(this);
    }
  }

  async createLiquidityListFiltersStore() {
    if (isNull(this.liquidityListFiltersStore)) {
      const { LiquidityListFiltersStore } = await import('@modules/liquidity/store/liquidity-list-filters.stores');
      this.liquidityListFiltersStore = new LiquidityListFiltersStore();
    }
  }

  async createLiquidityItemStore() {
    if (isNull(this.liquidityItemStore)) {
      const { LiquidityItemStore } = await import('@modules/liquidity/store/liquidity-item.store');
      this.liquidityItemStore = new LiquidityItemStore(this);
    }
  }

  async createLiquidityV3PoolStore() {
    if (isNull(this.liquidityV3PoolStore)) {
      const { LiquidityV3PoolStore } = await import('@modules/liquidity/store/liquidity-v3-pool.store');
      this.liquidityV3PoolStore = new LiquidityV3PoolStore(this);
    }
  }

  async createLiquidityV3PositionStore() {
    if (isNull(this.liquidityV3PositionStore)) {
      const { LiquidityV3PositionStore } = await import('@modules/liquidity/store/liquidity-v3-position.store');
      this.liquidityV3PositionStore = new LiquidityV3PositionStore();
    }
  }

  async createLiquidityV3PositionsStore() {
    if (isNull(this.liquidityV3PositionsStore)) {
      const { LiquidityV3PositionsStore } = await import('@modules/liquidity/store/liquidity-v3-positions.store');
      this.liquidityV3PositionsStore = new LiquidityV3PositionsStore(this);
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

  async createFarmingListStatsStore() {
    if (isNull(this.farmingListStatsStore)) {
      const { FarmingListStatsStore } = await import('@modules/farming/store/farming-list-stats.store');
      this.farmingListStatsStore = new FarmingListStatsStore(this);
    }
  }

  async createFarmingListStore() {
    if (isNull(this.farmingListStore)) {
      const { FarmingListStore } = await import('@modules/farming/store/farming-list.store');
      this.farmingListStore = new FarmingListStore(this);
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
