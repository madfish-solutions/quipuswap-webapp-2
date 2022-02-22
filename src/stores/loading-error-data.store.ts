import { Nullable } from '@quipuswap/ui-kit';
import { action, makeObservable, observable } from 'mobx';

import { Undefined } from '@utils/types';

export class LoadingErrorData<RawData, Data> {
  rawData: Undefined<RawData>;
  data: Data;

  isLoading = false;
  error: Nullable<Error> = null;

  constructor(
    private defaultData: Data,
    private getDate: () => Promise<RawData>,
    private mapping: (data: RawData) => Data
  ) {
    this.data = defaultData;
    makeObservable(this, {
      rawData: observable,
      data: observable,
      isLoading: observable,
      error: observable,

      setRawData: action,
      startLoading: action,
      finishLoading: action
    });
  }

  setRawData(rawData: RawData) {
    this.error = null;
    this.rawData = rawData;
    this.data = this.mapping(rawData);
  }

  setError(error: Error) {
    this.error = error;
    this.rawData = undefined;
    this.data = this.defaultData;
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
      this.setRawData(await this.getDate());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      this.setError(error as Error);

      return Promise.reject(error);
    } finally {
      this.finishLoading();
    }

    return undefined;
  }
}
