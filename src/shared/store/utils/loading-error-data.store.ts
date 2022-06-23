import { action, computed, makeObservable, observable } from 'mobx';

import { SERVER_UNAVAILABLE_ERROR_MESSAGE, SERVER_UNAVAILABLE_MESSAGE } from '@config/constants';

import { Undefined, Nullable } from '../../types/types';

export class LoadingErrorData<RawData, Data> {
  rawData: Undefined<RawData>;
  data: Data;

  isInitialized = false;
  isLoading = false;
  error: Nullable<Error | string> = null;

  constructor(
    private defaultData: Data,
    private getDate: () => Promise<RawData>,
    private mapping: (data: RawData) => Data
  ) {
    this.data = defaultData;
    makeObservable(this, {
      rawData: observable,
      data: observable,
      isInitialized: observable,
      isLoading: observable,
      error: observable,

      setRawData: action,
      startLoading: action,
      finishLoading: action,

      isReady: computed
    });
  }

  get isReady() {
    return !this.isLoading && this.isInitialized;
  }

  setRawData(rawData: RawData) {
    this.error = null;
    this.rawData = rawData;
    this.data = this.mapping(rawData);
  }

  setError(error: Error | string) {
    this.error = error;
    this.rawData = undefined;
    this.data = this.defaultData;
  }

  startLoading() {
    this.isLoading = true;
    this.isInitialized = true;
  }

  finishLoading() {
    this.isLoading = false;
  }

  async load() {
    try {
      this.startLoading();
      this.setRawData(await this.getDate());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error', error);
      if (error instanceof Error && error.message.includes(SERVER_UNAVAILABLE_ERROR_MESSAGE)) {
        this.setError(SERVER_UNAVAILABLE_MESSAGE);
      } else {
        this.setError(error as Error);
      }

      throw error;
    } finally {
      this.finishLoading();
    }

    return undefined;
  }
}
