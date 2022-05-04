import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface PreparedTokenData {
  token: Token;
  reserves: BigNumber;
  exchangeRate: BigNumber;
}
