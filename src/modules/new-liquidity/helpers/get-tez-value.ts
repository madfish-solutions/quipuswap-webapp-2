import BigNumber from 'bignumber.js';

import { isTezosToken } from '@shared/helpers';
import { AmountToken } from '@shared/types';

const ZERO_BN = new BigNumber('0');

export const getTezValue = (tokensAndAmounts: Array<AmountToken>) => {
  return tokensAndAmounts.find(item => isTezosToken(item.token))?.amount ?? ZERO_BN;
};
