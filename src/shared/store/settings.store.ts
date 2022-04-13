import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { DEFAULT_DEADLINE_MINS, DEFAULT_SLIPPAGE_PERCENTAGE } from '@config/constants';
import { GLOBAL_SETTINGS_KEY } from '@config/localstorage';

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

export const defaultSettings: RawSettings = {
  liquiditySlippage: DEFAULT_SLIPPAGE_PERCENTAGE,
  tradingSlippage: DEFAULT_SLIPPAGE_PERCENTAGE,
  transactionDeadline: DEFAULT_DEADLINE_MINS
};

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

  get settings() {
    return this.settingsModel.model;
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      settingsModel: observable,

      updateSettings: action,
      resetSettings: action,

      settings: computed
    });
  }

  updateSettings(newSettings: RawSettings) {
    this.settingsModel.update(newSettings);
  }

  resetSettings() {
    this.settingsModel.reset();
  }
}
