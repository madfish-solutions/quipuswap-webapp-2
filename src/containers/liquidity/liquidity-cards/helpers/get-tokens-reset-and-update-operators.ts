import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { allowContractSpendYourTokens } from '@api/helpers/allow-contract-spend-your-tokens';
import { Token } from '@utils/types';

const RESET_AMOUNT = 0;
const RESET_AMOUNT_BN = new BigNumber(RESET_AMOUNT);

export const getTokensResetAndUpdateOperators = async (
  tezos: TezosToolkit,
  tokenA: Token,
  tokenB: Token,
  dexAddress: string,
  accountPkh: string,
  tokenAAmount: BigNumber,
  tokenBAmount: BigNumber
) => {
  const tokenAResetOperator = allowContractSpendYourTokens(tezos, tokenA, dexAddress, RESET_AMOUNT_BN, accountPkh);
  const tokenBResetOperator = allowContractSpendYourTokens(tezos, tokenB, dexAddress, RESET_AMOUNT_BN, accountPkh);
  const tokenAUpdateOperator = allowContractSpendYourTokens(tezos, tokenA, dexAddress, tokenAAmount, accountPkh);
  const tokenBUpdateOperator = allowContractSpendYourTokens(tezos, tokenB, dexAddress, tokenBAmount, accountPkh);

  return Promise.all([tokenAUpdateOperator, tokenBUpdateOperator, tokenAResetOperator, tokenBResetOperator]);
};
