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
    const dtoFieldDisignType = Reflect.getOwnMetadata(prototype, dtoField.propertyKey);
    // eslint-disable-next-line no-console
    console.log('dtoFieldDisignType', dtoFieldDisignType, dtoFieldDisignType === undefined);

    //   if (Reflect.getOwnMetadata(TYPED_MARK_SYMBOL, dtoFieldDisignType.prototype)) {
    //     mapperConfig[dtoField.propertyKey] = createConfigMap(dtoFieldDisignType.prototype);
    //   } else {
    //     mapperConfig[dtoField.propertyKey] = getMapperKind(dtoFieldDisignType);
    //   }
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

export const mapperReader = (initialObject: Record<string, any>, mapperConfig: MapperConfig) => {
  // eslint-disable-next-line no-console
  console.log('initialObject', initialObject);
  // eslint-disable-next-line no-console
  console.log('mapperConfig', mapperConfig);

  const initialObjetEntries = Object.entries(initialObject);
  const mappedEntries: Array<[string, any]> = initialObjetEntries.map(([key, value]) => {
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

  return Object.fromEntries(mappedEntries);
};
