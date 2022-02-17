import BigNumber from 'bignumber.js';

import { RawToken } from '@interfaces/types';

const DECIMALS_BASE = 10;

export const toDecimals = (num: BigNumber, decimalsOrToken: number | RawToken): BigNumber =>
  num.times(
    new BigNumber(DECIMALS_BASE).pow(
      typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.metadata.decimals
    )
  );
