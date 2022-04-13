import { ContractMethod, TezosToolkit, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { batchOperations } from '@shared/helpers';
import { Token } from '@shared/types';

import { allowContractSpendYourTokens } from './allow-contract-spend-your-tokens';
import { disallowContractSpendYourTokens } from './disallow-contract-spend-your-tokens';

export const withApproveApiNew = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: Array<ContractMethod<Wallet>>
) => {
  const resetOperatorPromise = disallowContractSpendYourTokens(tezos, token, contractAddress, accountPkh);
  const updateOperatorPromise = allowContractSpendYourTokens(tezos, token, contractAddress, amount, accountPkh);
  const [resetOperator, updateOperator] = await Promise.all([resetOperatorPromise, updateOperatorPromise]);

  return await (await batchOperations(tezos, [updateOperator, ...operationParams, resetOperator])).send();
};
