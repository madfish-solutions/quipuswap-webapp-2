import BigNumber from 'bignumber.js';

import { WhitelistedToken } from '@utils/types';

const DECIMALS_BASE = 10;

export const toDecimals = (num: BigNumber, decimalsOrToken: number | WhitelistedToken): BigNumber =>
  num.times(
    new BigNumber(DECIMALS_BASE).pow(
      typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.metadata.decimals
    )
  );
