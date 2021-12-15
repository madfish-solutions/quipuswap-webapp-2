import BigNumber from 'bignumber.js';

import { WhitelistedToken } from '@utils/types';

export enum SwapAction {
  SWAP = 'swap',
  SEND = 'send'
}

export interface SwapFormValues {
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  inputAmount: BigNumber;
  outputAmount: BigNumber;
  recipient: string;
  slippage: BigNumber;
  action: SwapAction;
}

export type SwapAmountField = 'inputAmount' | 'outputAmount';
