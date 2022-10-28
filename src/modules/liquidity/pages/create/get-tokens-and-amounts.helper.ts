import { BigNumber } from 'bignumber.js';

import { toAtomic } from '@shared/helpers';
import { Token } from '@shared/types';

export const getTokensAndAmounts = (values: Array<BigNumber>, tokens: Array<Token>) => {
  return Object.values(values)
    .filter(Number)
    .map((amount, index) => ({
      token: tokens[index],
      amount: toAtomic(amount, tokens[index].metadata.decimals)
    }));
};
