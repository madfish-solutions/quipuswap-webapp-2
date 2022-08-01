import { createConfigMap, MapperConfig } from '@shared/mapping';

import { LoadingErrorData2 } from '../store';
import { Constructable } from '../types';
import { LED_METADATA_KEY } from './led-metadata-key';
import { LedMetadataValue } from './types';

export const ModelBuilder = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <T extends Constructable<any>>(Constructor: T) {
    return class extends Constructor {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        super(...args);

        const ledFields = Reflect.getOwnMetadata<Array<LedMetadataValue>>(LED_METADATA_KEY, Constructor.prototype);

        ledFields.forEach(({ propertyKey, defaultData, getData, dto, model }) => {
          const mapperConfig: MapperConfig = createConfigMap(dto.prototype);

          // @ts-ignore
          this[propertyKey] = new LoadingErrorData2(defaultData, getData, mapperConfig, model);
        });
      }
    };
  };
};
