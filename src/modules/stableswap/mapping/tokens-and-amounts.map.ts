import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export const tokensAndAmountsMapper = (tokens: Array<Token>, amounts: Array<BigNumber>) =>
  tokens.map((token, index) => ({ token, amount: amounts[index] }));
