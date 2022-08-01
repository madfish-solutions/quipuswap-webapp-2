/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingErrorDataNew } from '../store';
import { Constructable } from '../types';
import { LED_METADATA_KEY } from './led-metadata-key';
import { createConfigMap, MapperConfig } from './mapper';
import { LedMetadataValue } from './types';

export const ModelBuilder = () => {
  return function <T extends Constructable<any>>(Constructor: T) {
    return class extends Constructor {
      constructor(...args: any[]) {
        super(...args);

        const ledFields = Reflect.getOwnMetadata<Array<LedMetadataValue>>(LED_METADATA_KEY, Constructor.prototype);

        ledFields.forEach(({ propertyKey, defaultData, getData, dto, model }) => {
          const mapperConfig: MapperConfig = createConfigMap(dto.prototype);

          // @ts-ignore
          this[propertyKey] = new LoadingErrorDataNew(defaultData, getData, mapperConfig, model);
        });
      }
    };
  };
};
