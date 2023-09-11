/* eslint-disable @typescript-eslint/no-explicit-any */
import { action, computed, makeObservable, observable } from 'mobx';

import { mapperReader, MapperConfig } from '@shared/model-builder';
import { Constructable } from '@shared/types';

export class LoadingErrorData<
  ModelType extends object,
  Default = any,
  RawData extends Record<string, any> | Record<string, any>[] = any
> {
  rawData: RawData | undefined;

  isInitialized = false;
  isLoading = false;
  error: Error | string | null = null;
  model: ModelType | Default;

  constructor(
    private defaultData: Default,
    private getDate: () => Promise<RawData>,
    private mappingConfig: MapperConfig,
    private modelRef: Constructable<ModelType>
  ) {
    this.model = defaultData as unknown as ModelType;

    makeObservable(this, {
      rawData: observable,
      isInitialized: observable,
      isLoading: observable,
      error: observable,
      model: observable,

      setRawData: action,
      startLoading: action,
      finishLoading: action,
      setError: action,

      isReady: computed
    });
  }

  get isReady() {
    return !this.isLoading && this.isInitialized;
  }

  resetData() {
    this.model = this.defaultData;
  }

  setRawData(rawData: RawData) {
    this.error = null;
    this.rawData = rawData;
    const data = mapperReader(rawData, this.mappingConfig) as unknown as Default;

    this.model = new this.modelRef(data);
  }

  setError(error: Error | string) {
    this.error = error;
    this.rawData = undefined;
    this.model = this.defaultData;
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
      const rawData = await this.getDate();
      this.setRawData(rawData);
    } catch (error) {
      this.setError(error as Error);

      throw error;
    } finally {
      this.finishLoading();
    }

    return undefined;
  }
}
