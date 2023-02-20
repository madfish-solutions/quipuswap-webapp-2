import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import {
  DEFAULT_DEADLINE_MINS,
  DEFAULT_LIQUIDITY_SLIPPAGE_PERCENTAGE,
  DEFAULT_TRADING_SLIPPAGE_PERCENTAGE
} from '@config/constants';
import { GLOBAL_SETTINGS_KEY, V3_POOLS_TOKENS_ORDER_KEY } from '@config/localstorage';
import { noopMap } from '@shared/mapping';

import { RootStore } from './root.store';
import { LocalStorageModel } from './utils';

interface RawSettings {
  liquiditySlippage: number;
  tradingSlippage: number;
  transactionDeadline: number;
}

export interface SettingsModel {
  liquiditySlippage: BigNumber;
  tradingSlippage: BigNumber;
  transactionDeadline: BigNumber;
}

export type V3PoolsTokensOrder = Record<number, boolean>;

export const defaultSettings: RawSettings = {
  liquiditySlippage: DEFAULT_LIQUIDITY_SLIPPAGE_PERCENTAGE,
  tradingSlippage: DEFAULT_TRADING_SLIPPAGE_PERCENTAGE,
  transactionDeadline: DEFAULT_DEADLINE_MINS
};

export const defaultV3PoolsTokensOrder: V3PoolsTokensOrder = {};

const settingsMapper = (rawSettings: RawSettings): SettingsModel => {
  return {
    ...rawSettings,
    liquiditySlippage: new BigNumber(rawSettings.liquiditySlippage),
    tradingSlippage: new BigNumber(rawSettings.tradingSlippage),
    transactionDeadline: new BigNumber(rawSettings.transactionDeadline)
  };
};
export class SettingsStore {
  settingsModel = new LocalStorageModel(GLOBAL_SETTINGS_KEY, defaultSettings, settingsMapper);
  v3PoolsTokensOrderModel = new LocalStorageModel(V3_POOLS_TOKENS_ORDER_KEY, defaultV3PoolsTokensOrder, noopMap);

  get settings() {
    return this.settingsModel.model;
  }

  get v3PoolsTokensOrder() {
    return this.v3PoolsTokensOrderModel.model;
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      settingsModel: observable,
      v3PoolsTokensOrderModel: observable,

      updateSettings: action,
      updateV3PoolsTokensOrder: action,
      resetSettings: action,

      settings: computed,
      v3PoolsTokensOrder: computed
    });
  }

  updateSettings(newSettings: RawSettings) {
    this.settingsModel.update(newSettings);
  }

  updateV3PoolsTokensOrder(poolId: number, isTokenXToY: boolean) {
    this.v3PoolsTokensOrderModel.update({
      ...this.v3PoolsTokensOrder,
      [poolId]: isTokenXToY
    });
  }

  resetSettings() {
    this.settingsModel.reset();
  }
}
