/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from '@shared/helpers';

import { MapperConfig } from './mapper-config.type';
import { MapperKinds } from './mapper-kinds.enum';
import { mapperFactory } from './mapper.factory';

export const mapperReader = (
  initialObject: Record<string, any> | Array<Record<string, any>>,
  mapperConfig: MapperConfig
) => {
  const initialObjetEntries = Object.entries(initialObject);
  const mappedEntries: Array<[string, any]> = initialObjetEntries.map(([key, value]) => {
    try {
      if (isUndefined(mapperConfig[key])) {
        return ['', ''];
      }
      const { optional, nullable, isArray, mapper: configMapper, shape } = mapperConfig[key];

      if (isArray) {
        return [key, value.map((value2: any) => mapperReader(value2, shape))];
      }

      if (typeof value === 'object') {
        return [key, mapperReader(value, shape)];
      }

      const mapper = mapperFactory[configMapper as MapperKinds];

      if (mapper) {
        return [key, mapper(value, optional, nullable)];
      }

      return [key, value];
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e);
      throw Error(e.message);
    }
  });

  return Object.fromEntries(mappedEntries);
};
