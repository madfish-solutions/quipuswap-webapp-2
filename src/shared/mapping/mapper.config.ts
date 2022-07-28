/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';

import { TYPED_MARK_SYMBOL } from '@shared/decorators';

enum MapperKinds {
  NUMBER,
  BIGNUMBER
}

export type MapperConfig = Record<string, any>;

const mapperFactory = {
  [MapperKinds.NUMBER]: (arg: any) => Number(arg),
  [MapperKinds.BIGNUMBER]: (arg: any) => new BigNumber(arg)
};

export const createConfigMap = (prototype: any) => {
  // eslint-disable-next-line no-console
  console.log('prototype', prototype);
  const mapperConfig: Record<any, any> = {};
  const dtoFields = Reflect.getOwnMetadata(TYPED_MARK_SYMBOL, prototype);
  // eslint-disable-next-line no-console
  console.log('dtoFields', dtoFields);

  for (const dtoField of dtoFields) {
    mapperConfig[dtoField.propertyKey] = getMapperKind(dtoField.type);
  }

  // eslint-disable-next-line no-console
  console.log('mapperConfig', mapperConfig);

  return mapperConfig;
};

export const getMapperKind = (_type: any) => {
  switch (_type) {
    case Number:
      return MapperKinds.NUMBER;
    case BigNumber:
      return MapperKinds.BIGNUMBER;
    default:
      throw TypeError();
  }
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const mapperReader = (initialObject: Record<string, any>, mapperConfig: MapperConfig) => {
  // eslint-disable-next-line no-console
  console.log('initialObject', initialObject);
  // eslint-disable-next-line no-console
  console.log('mapperConfig', mapperConfig);

  if (Array.isArray(initialObject)) {
    return initialObject.map(obj => {
      const initialObjetEntries = Object.entries(obj);
      const mappedEntries: Array<[string, any]> = initialObjetEntries.map(([key, value]) => {
        // eslint-disable-next-line no-console
        console.log('key', key);
        // eslint-disable-next-line no-console
        console.log('value', value);

        try {
          const mapper = mapperFactory[mapperConfig[key] as MapperKinds];

          if (mapper) {
            return [key, mapper(value)];
          }

          return [key, value];
        } catch (e: any) {
          // eslint-disable-next-line no-console
          console.error(e);
          throw Error(e.message);
        }
      });

      // eslint-disable-next-line no-console
      console.log('mappedEntries', mappedEntries);

      return Object.fromEntries(mappedEntries);
    });
  }

  const initialObjetEntries = Object.entries(initialObject);
  // eslint-disable-next-line sonarjs/no-identical-functions
  const mappedEntries: Array<[string, any]> = initialObjetEntries.map(([key, value]) => {
    // eslint-disable-next-line no-console
    console.log('key', key);
    // eslint-disable-next-line no-console
    console.log('value', value);

    try {
      if (typeof value === 'object') {
        return [key, mapperReader(value, mapperConfig[key])];
      }

      const mapper = mapperFactory[mapperConfig[key] as MapperKinds];

      if (mapper) {
        return [key, mapper(value)];
      }

      return [key, value];
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e);
      throw Error(e.message);
    }
  });

  // eslint-disable-next-line no-console
  console.log('mappedEntries', mappedEntries);

  return Object.fromEntries(mappedEntries);
};
