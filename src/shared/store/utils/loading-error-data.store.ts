import { action, computed, makeObservable, observable } from 'mobx';

import { SERVER_UNAVAILABLE_ERROR_MESSAGE, SERVER_UNAVAILABLE_MESSAGE } from '@config/constants';
import { Undefined, Nullable, Constructable } from '@shared/types';

import { MapperConfig, mapperReader } from '../../mapping/mapper.config';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class LoadingErrorData2<ModelType extends object, Data = any, RawData = any> {
  rawData: RawData | undefined;
  data: Data;

  isInitialized = false;
  isLoading = false;
  error2: Error | string | null = null;
  model: Undefined<ModelType>;

  constructor(
    private defaultData: Data,
    private getDate: () => Promise<RawData>,
    private mappingConfig: MapperConfig,
    private modelRef: Constructable<ModelType>
  ) {
    this.data = defaultData;

    makeObservable(this, {
      rawData: observable,
      data: observable,
      isInitialized: observable,
      isLoading: observable,
      error2: observable,
      model: observable,

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
    this.error2 = null;
    this.rawData = rawData;
    this.data = mapperReader(rawData, this.mappingConfig) as unknown as Data;

    this.model = new this.modelRef(this.data);
  }

  setError2(error: Error | string) {
    this.error2 = error;
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
      this.setError2(error as Error);

      throw error;
    } finally {
      this.finishLoading();
    }

    return undefined;
  }
}
