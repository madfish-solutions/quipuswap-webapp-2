import BigNumber from 'bignumber.js';

import { TEN } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';

export const toDecimals = (num: BigNumber, decimalsOrToken: number | WhitelistedToken): BigNumber =>
  num.times(
    new BigNumber(TEN).pow(typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.metadata.decimals)
  );
