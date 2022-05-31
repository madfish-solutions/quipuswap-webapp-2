import { BigNumber } from 'bignumber.js';

import { isNull, toDecimals } from '@shared/helpers';
import { Token } from '@shared/types';

export const tokensAndAmountsMapper = (tokens: Array<Token>, amounts: Array<Nullable<BigNumber>>) =>
  tokens.map((token, index) => {
    const _amount = amounts[index];
    const amount = isNull(_amount) ? new BigNumber('0') : toDecimals(_amount, token);

    return { token, amount };
  });
