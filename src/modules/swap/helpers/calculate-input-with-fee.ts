import { BigNumber } from 'bignumber.js';

import { isUndefined } from '@shared/helpers';
import { DexPair, Undefined } from '@shared/types';

// DexPairType;

// enum Fee {
//   DEX_ONE = 0.3,
//   DEX_TWO = 0.35
// }

export const calculateInputWithFee = async (route: Undefined<Array<DexPair>>, inputAmount: Undefined<BigNumber>) => {
  if (isUndefined(route) || isUndefined(inputAmount)) {
    return;
  }

  // const stableSwapFee = await Promise.resolve(0.5);
  // const devFee = await Promise.resolve(0.3);
};
