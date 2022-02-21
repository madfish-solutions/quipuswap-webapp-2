import { Nullable } from '@quipuswap/ui-kit';
import { action, makeObservable, observable } from 'mobx';

import { Undefined } from '@utils/types';

export class LoadingErrorData<RawData, Data> {
  rawData: Undefined<RawData>;
  data: Data;

  isLoading = false;
  error: Nullable<Error> = null;

  constructor(private defaultData: Data, private mapping: (data: RawData) => Data) {
    this.data = defaultData;
    makeObservable(this, {
      rawData: observable,
      data: observable,
      isLoading: observable,
      error: observable,

      setData: action,
      startLoading: action,
      finishLoading: action
    });
  }

  setData(rawData: RawData | Error) {
    if (rawData instanceof Error) {
      this.error = rawData;
      this.rawData = undefined;
      this.data = this.defaultData;
    } else {
      this.error = null;
      this.rawData = rawData;
      this.data = this.mapping(rawData);
    }
  }

  startLoading() {
    this.isLoading = true;
  }

  finishLoading() {
    this.isLoading = false;
  }
}
