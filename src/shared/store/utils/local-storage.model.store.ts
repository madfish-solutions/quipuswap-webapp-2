import { action, makeObservable, observable } from 'mobx';

export const localStorageExstractor = <RawData, Model>(
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

export class LocalStorageModel<RawData, Model> {
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
