import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface StableFarmRewardDetailsParams {
  token: Token;
  claimable: { amount: BigNumber; dollarEquivalent: BigNumber };
}

export interface StableFarmRewardProps {
  rawData: Array<StableFarmRewardDetailsParams>;
}
