import { batchify } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Token } from '@shared/types';

import { allowContractSpendYourTokens } from './allow-contract-spend-your-tokens';
//TODO
const RESET_AMOUNT = 0;

export const withApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams
) => {
  const resetOperatorPromise = allowContractSpendYourTokens(tezos, token, contractAddress, RESET_AMOUNT, accountPkh);
  const updateOperatorPromise = allowContractSpendYourTokens(tezos, token, contractAddress, amount, accountPkh);
  const [resetOperator, updateOperator] = await Promise.all([resetOperatorPromise, updateOperatorPromise]);

  return await batchify(tezos.wallet.batch([]), [
    resetOperator.toTransferParams(),
    updateOperator.toTransferParams(),
    operationParams,
    resetOperator.toTransferParams()
  ]).send();
};
