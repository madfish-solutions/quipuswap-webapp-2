import BigNumber from 'bignumber.js';

import { Token } from '../../types';

export const fromDecimals = (num: BigNumber, decimalsOrToken: number | Token) =>
  num.div(
    new BigNumber(10).pow(typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.metadata.decimals)
  );
