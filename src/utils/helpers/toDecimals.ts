import BigNumber from 'bignumber.js';

import { WhitelistedToken } from '@utils/types';

export const toDecimals = (
  num: BigNumber,
  decimalsOrToken: number | WhitelistedToken,
) : BigNumber => num.times(new BigNumber(10).pow(
  typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.metadata.decimals,
));
