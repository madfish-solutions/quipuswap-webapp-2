import BigNumber from 'bignumber.js';

import { WhitelistedToken } from '@utils/types';

export const fromDecimals = (num: BigNumber, decimalsOrToken: number | WhitelistedToken) =>
  num.div(
    new BigNumber(10).pow(typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.metadata.decimals)
  );
