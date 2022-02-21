import { Nullable } from '@quipuswap/ui-kit';
import { action, makeObservable, observable } from 'mobx';

import { Undefined } from '@utils/types';

export class LoadingErrorData<RawData, Data> {
  rawData: Undefined<RawData>;
  data: Data;
  isLoading = false;
  error: Nullable<Error> = null;
  isInitialized = false;

  constructor(
    private defaultData: Data,
    private getDate: () => Promise<RawData>,
    private mapping: (data: RawData) => Data
  ) {
    this.data = defaultData;
    makeObservable(this, {
      load: action,
      rawData: observable,
      data: observable,
      isLoading: observable,
      error: observable
    });
  }

  async load() {
    try {
      this.isLoading = true;
      this.isInitialized = true;
      this.rawData = await this.getDate();
      this.data = this.mapping(this.rawData);
      this.error = null;
    } catch (error) {
      this.error = error as Error;
      this.data = this.defaultData;
    } finally {
      this.isLoading = false;
    }
  }
}
