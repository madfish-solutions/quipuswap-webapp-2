import { ContractMethod, TezosToolkit, Wallet } from '@taquito/taquito';

import { WhitelistedToken } from '@utils/types';
import BigNumber from 'bignumber.js';

export const updateOperator = async (
  tezos: TezosToolkit,
  token: WhitelistedToken,
  spender: string,
  amount: BigNumber.Value,
  owner: string,
):Promise<ContractMethod<Wallet> | null> => {
  const tokenContract = await tezos.wallet.at(token.contractAddress);

  switch (token.type) {
    case 'fa1.2':
      return tokenContract.methods.approve(
        spender,
        amount,
      );
    case 'fa2':
      return tokenContract.methods.update_operators([{
        add_operator: {
          owner,
          operator: spender,
          token_id: token.fa2TokenId,
        },
      }]);

    default:
      return null;
  }
};
