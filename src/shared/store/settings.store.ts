import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { DEFAULT_DEADLINE_MINS, DEFAULT_SLIPPAGE_PERCENTAGE } from '@config/constants';

import { RootStore } from './root.store';

const GLOBAL_SETTINGS_KEY = 'globalSettings';

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

const localStorageExstractor = <RawData, Model>(
  key: string,
  mapper: (raw: RawData) => Model,
  defaultValue: RawData
): [Model, boolean] => {
  const stringData = localStorage.getItem(key);

  if (stringData) {
    const rawData = JSON.parse(stringData);

    return [mapper(rawData), false];
  }

  return [mapper(defaultValue), true];
};

class LocalStorageModel<RawData, Model> {
  model!: Model;
  constructor(private key: string, private defaultValue: RawData, private mapping: (raw: RawData) => Model) {
    this.getModel();

    makeObservable(this, {
      model: observable,

      getModel: action,
      update: action
    });
  }

  getModel() {
    const [model, isNew] = localStorageExstractor(this.key, this.mapping, this.defaultValue);
    if (isNew) {
      this.update(this.defaultValue);
    }
    this.model = model;
  }

  reset() {
    this.update(this.defaultValue);
  }

  update(value: RawData) {
    const newValue = JSON.stringify(value);
    localStorage.setItem(this.key, newValue);

    this.model = this.mapping(value);
  }
}

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
