import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { ZERO } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';

import { allowContractSpendYourTokens } from './allow-contract-spend-your-tokens';

export const getTokensResetAndUpdateOperators = async (
  tezos: TezosToolkit,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  dexAddress: string,
  accountPkh: string,
  tokenAAmount: BigNumber,
  tokenBAmount: BigNumber
) => {
  const tokenAResetOperator = allowContractSpendYourTokens(tezos, tokenA, dexAddress, ZERO, accountPkh);
  const tokenBResetOperator = allowContractSpendYourTokens(tezos, tokenB, dexAddress, ZERO, accountPkh);
  const tokenAUpdateOperator = allowContractSpendYourTokens(tezos, tokenA, dexAddress, tokenAAmount, accountPkh);
  const tokenBUpdateOperator = allowContractSpendYourTokens(tezos, tokenB, dexAddress, tokenBAmount, accountPkh);

  return Promise.all([tokenAUpdateOperator, tokenBUpdateOperator, tokenAResetOperator, tokenBResetOperator]);
};
