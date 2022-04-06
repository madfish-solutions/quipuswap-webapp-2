import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from './root.store';

const GLOBAL_SETTINGS_KEY = 'globalSettings';

interface RawSettings {
  liquiditySlippage: string;
  tradingSlippage: string;
  transactionDeadline: string;
}

interface SettingsModel {
  liquiditySlippage: BigNumber;
  tradingSlippage: BigNumber;
  transactionDeadline: string;
}

const defaultSettings: RawSettings = {
  liquiditySlippage: '0',
  tradingSlippage: '0.5',
  transactionDeadline: '30m'
};

const settingsMapper = (rawSettings: RawSettings): SettingsModel => {
  return {
    ...rawSettings,
    liquiditySlippage: new BigNumber(rawSettings.liquiditySlippage),
    tradingSlippage: new BigNumber(rawSettings.tradingSlippage),
    transactionDeadline: rawSettings.transactionDeadline
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
  model: Model;
  constructor(private key: string, private defaultValue: RawData, private mapping: (raw: RawData) => Model) {
    this.model = this.getModel();

    makeObservable(this, {
      model: observable,

      getModel: action,
      reset: action,
      update: action
    });
  }

  getModel() {
    const [model, isNew] = localStorageExstractor(this.key, this.mapping, this.defaultValue);
    if (isNew) {
      this.update(this.defaultValue);
    }

    return model;
  }

  reset() {
    this.update(this.defaultValue);
  }

  update(value: RawData) {
    const newValue = JSON.stringify(value);
    localStorage.setItem(this.key, newValue);

    this.model = this.mapping(this.defaultValue);
  }
}

export class SettingsStore {
  settingsModel = new LocalStorageModel(GLOBAL_SETTINGS_KEY, defaultSettings, settingsMapper);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      settingsModel: observable
    });
  }
}
