import { BigNumber } from 'bignumber.js';

import { saveBigNumber } from '@shared/helpers';
import { Token } from '@shared/types';

export const tokensAndAmountsMapper = (tokens: Array<Token>, amounts: Array<Nullable<BigNumber>>) =>
  tokens.map((token, index) => ({ token, amount: saveBigNumber(amounts[index], new BigNumber('0')) }));
