import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface StableDividendsRewardDetailsParams {
  token: Token;
  claimable: { amount: BigNumber; dollarEquivalent: BigNumber };
}

export interface StableDividendsRewardProps {
  rawData: Array<StableDividendsRewardDetailsParams>;
}
