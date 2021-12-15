import { ContractMethod, TezosToolkit, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { WhitelistedToken } from '@utils/types';

export const allowContractSpendYourTokens = async (
  tezos: TezosToolkit,
  token: WhitelistedToken,
  spender: string,
  amount: BigNumber.Value,
  owner: string
): Promise<ContractMethod<Wallet> | null> => {
  const tokenContract = await tezos.wallet.at(token.contractAddress);

  switch (token.type) {
    case 'fa1.2':
      return tokenContract.methods.approve(spender, amount);
    case 'fa2':
      return tokenContract.methods.update_operators([
        {
          add_operator: {
            owner,
            operator: spender,
            token_id: token.fa2TokenId
          }
        }
      ]);

    default:
      return null;
  }
};
