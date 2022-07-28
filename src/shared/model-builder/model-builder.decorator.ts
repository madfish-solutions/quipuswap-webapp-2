/* eslint-disable @typescript-eslint/no-explicit-any */
import { createConfigMap, MapperConfig } from '@shared/mapping';

import { LoadingErrorData2 } from '../store';
import { LED_METADATA_KEY } from './led-metadata-key';
import { LedMetadataValue } from './types';

export const ModelBuilder = () => {
  return function <T extends { new (...args: any[]): object }>(Constructor: T) {
    return class extends Constructor {
      constructor(...args: any[]) {
        super(...args);

        const ledFields = Reflect.getOwnMetadata<Array<LedMetadataValue>>(LED_METADATA_KEY, Constructor.prototype);

        ledFields.forEach(({ propertyKey, defaultData, getData, dto }) => {
          const mapperConfig: MapperConfig = createConfigMap(dto.prototype);
          // eslint-disable-next-line no-console
          console.log('mapperConfig', mapperConfig);

          // @ts-ignore
          this[propertyKey] = new LoadingErrorData2(defaultData, getData, mapperConfig);
        });
      }
    };
  };
};
