import { Nullable } from '@quipuswap/ui-kit';
import { action, makeObservable, observable } from 'mobx';

import { Undefined } from '@utils/types';

export class LoadingErrorData<T> {
  data: Undefined<T>;
  isLoading = false;
  error: Nullable<Error> = null;

  constructor(private getDate: () => Promise<T>, private defaultData?: T) {
    this.data = defaultData;
    makeObservable(this, {
      load: action,
      data: observable,
      isLoading: observable,
      error: observable
    });
  }

  async load() {
    this.isLoading = true;
    try {
      this.data = await this.getDate();
      this.error = null;
    } catch (error) {
      this.error = error as Error;
      this.data = this.defaultData;
    }
    this.isLoading = false;
  }
}
