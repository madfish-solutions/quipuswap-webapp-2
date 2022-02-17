import BigNumber from 'bignumber.js';

import { RawToken } from '@interfaces/types';

export const fromDecimals = (num: BigNumber, decimalsOrToken: number | RawToken) =>
  num.div(
    new BigNumber(10).pow(typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.metadata.decimals)
  );
