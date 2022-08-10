import { action, computed, makeObservable, observable } from 'mobx';

import { mapperReader, MapperConfig } from '@shared/model-builder';
import { Constructable } from '@shared/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class LoadingErrorDataNew<ModelType extends object, Default = any, RawData = any> {
  rawData: RawData | undefined;

  isInitialized = false;
  isLoading = false;
  error2: Error | string | null = null;
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
    const data = mapperReader(rawData, this.mappingConfig) as unknown as Default;

    this.model = new this.modelRef(data);
  }

  setError2(error: Error | string) {
    this.error2 = error;
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
