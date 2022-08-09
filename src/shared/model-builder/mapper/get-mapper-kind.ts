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
    default:
      throw TypeError();
  }
};
