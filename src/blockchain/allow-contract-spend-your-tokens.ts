import { ContractMethod, TezosToolkit, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Standard, Token } from '@shared/types';

export const allowContractSpendYourTokens = async (
  tezos: TezosToolkit,
  token: Token,
  spender: string,
  amount: BigNumber.Value,
  owner: string
): Promise<ContractMethod<Wallet>> => {
  const tokenContract = await tezos.wallet.at(token.contractAddress);

  if (token.type === Standard.Fa12) {
    return tokenContract.methods.approve(spender, amount);
  }

  return tokenContract.methods.update_operators([
    {
      add_operator: {
        owner,
        operator: spender,
        token_id: token.fa2TokenId
      }
    }
  ]);
};
