/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingErrorData } from '../store';
import { Constructable } from '../types';
import { LED_METADATA_KEY } from './led-metadata-key';
import { createConfigMap, MapperConfig } from './mapper';
import { LedMetadataValue } from './types';

export const ModelBuilder = () => {
  return function <T extends Constructable>(Constructor: T) {
    return class extends Constructor {
      [key: LedMetadataValue['propertyKey']]: LoadingErrorData<object, any, any>;
      constructor(...args: any[]) {
        super(...args);

        const ledFields = Reflect.getOwnMetadata<Array<LedMetadataValue>>(LED_METADATA_KEY, Constructor.prototype);

        ledFields.forEach(({ propertyKey, default: defaultData, loader, model }) => {
          const mapperConfig: MapperConfig = createConfigMap(model.prototype)!;

          this[propertyKey] = new LoadingErrorData(defaultData, async () => loader(this), mapperConfig, model);
        });
      }
    };
  };
};
