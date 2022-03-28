import BigNumber from 'bignumber.js';

import { Token } from '../types/types';

const BASE = 10;

export const fromDecimals = (num: BigNumber, decimalsOrToken: number | Token) =>
  num.div(
    new BigNumber(BASE).pow(typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.metadata.decimals)
  );
