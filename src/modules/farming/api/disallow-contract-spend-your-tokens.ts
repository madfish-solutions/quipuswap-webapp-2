import { ContractMethod, TezosToolkit, Wallet } from '@taquito/taquito';

import { Standard, Token } from '@shared/types';

const RESET_AMOUNT = 0;

export const disallowContractSpendYourTokens = async (
  tezos: TezosToolkit,
  token: Token,
  spender: string,
  owner: string
): Promise<ContractMethod<Wallet>> => {
  const tokenContract = await tezos.wallet.at(token.contractAddress);

  if (token.type === Standard.Fa12) {
    return tokenContract.methods.approve(spender, RESET_AMOUNT);
  }

  return tokenContract.methods.update_operators([
    {
      remove_operator: {
        owner,
        operator: spender,
        token_id: token.fa2TokenId
      }
    }
  ]);
};
