import { MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { MapperKinds } from './mapper-kinds.enum';

export const getMapperKind = (_type: unknown) => {
  switch (_type) {
    case Number:
      return MapperKinds.NUMBER;
    case BigNumber:
      return MapperKinds.BIGNUMBER;
    case Boolean:
      return MapperKinds.BOOLEAN;
    case Date:
      return MapperKinds.DATE;
    case String:
      return MapperKinds.STRING;
    case Symbol:
      return MapperKinds.SYMBOL;
    case MichelsonMap:
      return MapperKinds.MICHELSON_MAP;
    default:
      throw TypeError();
  }
};
