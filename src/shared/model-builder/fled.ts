import { action, computed, makeObservable, observable } from 'mobx';

import { isExist } from '../helpers';
import { Nullable } from '../types';

// TODO: https://madfish.atlassian.net/browse/QUIPU-700
export class Fled<RawT, T> {
  rawData: Nullable<RawT> = null;
  isLoading = false;
  error: Error | string | null = null;
  model: Nullable<T> = null;

  constructor(private loader: () => Promise<RawT>, private mapper: (raw: RawT) => T) {
    makeObservable(this, {
      rawData: observable,
      isLoading: observable,
      error: observable,
      model: observable,

      startLoading: action,
      finishLoading: action,
      setError: action,
      setRaw: action,
      resetData: action,

      isReady: computed
    });
  }

  get isReady() {
    return !this.isLoading && isExist(this.model);
  }

  resetData() {
    this.rawData = null;
    this.model = null;
    this.isLoading = false;
    this.error = null;
  }

  setRaw(rawData: RawT) {
    this.error = null;
    this.rawData = rawData;
    this.model = this.mapper(rawData);
  }

  setError(error: Error | string) {
    this.error = error;
    this.rawData = null;
    this.model = null;
  }

  startLoading() {
    this.isLoading = true;
  }

  finishLoading() {
    this.isLoading = false;
  }

  async load() {
    try {
      this.startLoading();
      const rawData = await this.loader();
      this.setRaw(rawData);
    } catch (error) {
      this.setError(error as Error);

      throw error;
    } finally {
      this.finishLoading();
    }
  }
}
