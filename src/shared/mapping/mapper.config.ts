/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';

import { IMetadataVales, TYPED_MARK_SYMBOL } from '@shared/decorators';
import { isUndefined } from '@shared/helpers';
import { Standard } from '@shared/types';

enum MapperKinds {
  NUMBER,
  BIGNUMBER,
  BOOLEAN,
  STRING
}

export type MapperConfig = Record<string, any>;

const mapperFactory: Record<MapperKinds, (arg: any) => any> = {
  [MapperKinds.NUMBER]: (arg: any) => {
    const result = Number(arg);

    if (Number.isNaN(result)) {
      throw TypeError();
    }

    return result;
  },
  [MapperKinds.BIGNUMBER]: (arg: any) => new BigNumber(arg),
  [MapperKinds.BOOLEAN]: (arg: any) => Boolean(arg),
  [MapperKinds.STRING]: (arg: any) => String(arg)
};

export const createConfigMap = (prototype: any) => {
  const mapperConfig: Record<any, any> = {};
  const dtoFields = Reflect.getOwnMetadata<Array<IMetadataVales>>(TYPED_MARK_SYMBOL, prototype);

  for (const dtoField of dtoFields) {
    const dtoFieldMetadata = Reflect.getOwnMetadata<Array<IMetadataVales>>(TYPED_MARK_SYMBOL, dtoField.type.prototype);

    mapperConfig[dtoField.propertyKey] = { isArray: dtoField.isArray };

    if (dtoFieldMetadata) {
      mapperConfig[dtoField.propertyKey].shape = createConfigMap(dtoField.type.prototype);
    } else {
      mapperConfig[dtoField.propertyKey].mapper = getMapperKind(dtoField.type);
    }
  }

  return mapperConfig;
};

export const getMapperKind = (_type: any) => {
  switch (_type) {
    case Number:
      return MapperKinds.NUMBER;
    case BigNumber:
      return MapperKinds.BIGNUMBER;
    case Boolean:
      return MapperKinds.BOOLEAN;
    case String:
    case Standard:
      return MapperKinds.STRING;
    default:
      return {};
  }
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

      if (mapperConfig[key].isArray) {
        return [key, value.map((value2: any) => mapperReader(value2, mapperConfig[key].shape))];
      }

      if (typeof value === 'object') {
        return [key, mapperReader(value, mapperConfig[key].shape)];
      }

      const mapper = mapperFactory[mapperConfig[key].mapper as MapperKinds];

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
