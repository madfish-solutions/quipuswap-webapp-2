/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from 'bignumber.js';

import { isUndefined } from '@shared/helpers';

import { MapperConfig } from './mapper-config.type';
import { mapperFactory } from './mapper.factory';

const isObject = (value: any) => {
  return typeof value === 'object' && value !== null && !(value instanceof BigNumber) && !(value instanceof Date);
};

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

      if (isObject(value)) {
        return [key, mapperReader(value, shape)];
      }

      const mapper = mapperFactory[configMapper];

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
