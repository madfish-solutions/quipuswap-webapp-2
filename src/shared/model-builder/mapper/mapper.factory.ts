/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from 'bignumber.js';

import { checker } from './checker';
import { MapperKinds } from './mapper-kinds.enum';

export const mapperFactory: Record<MapperKinds, (arg: any, optional: boolean, nullable: boolean) => any> = {
  [MapperKinds.NUMBER]: (arg: any, optional: boolean, nullable: boolean) => {
    const check = checker(arg, optional, nullable);

    if (check) {
      return arg;
    }

    const result = Number(arg);

    if (Number.isNaN(result)) {
      throw TypeError();
    }

    return result;
  },
  [MapperKinds.BIGNUMBER]: (arg: any, optional: boolean, nullable: boolean) => {
    const check = checker(arg, optional, nullable);

    if (check) {
      return arg;
    }

    return new BigNumber(arg);
  },
  [MapperKinds.BOOLEAN]: (arg: any, optional: boolean, nullable: boolean) => {
    const check = checker(arg, optional, nullable);

    if (check) {
      return arg;
    }

    return Boolean(arg);
  },
  [MapperKinds.STRING]: (arg: any, optional: boolean, nullable: boolean) => {
    const check = checker(arg, optional, nullable);

    if (check) {
      return arg;
    }

    return String(arg);
  }
};
