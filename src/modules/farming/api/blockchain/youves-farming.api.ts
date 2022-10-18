import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { getStorageInfo } from '@shared/dapp';
import { Standard, TokenIdFa2 } from '@shared/types';

export namespace YouvesFarmingApi {
  export interface IFarmingStorage {
    deposit_token: {
      id: BigNumber;
      address: string;
    };
  }

  export const getToken = async (tezos: TezosToolkit, contractAddress: string): Promise<TokenIdFa2> => {
    const storage = await getStorageInfo<IFarmingStorage>(tezos, contractAddress);
    const { id, address } = storage.deposit_token;

    return {
      type: Standard.Fa2,
      fa2TokenId: id.toNumber(),
      contractAddress: address
    };
  };

  export const getStakes = async (tezos: TezosToolkit, accountPkh: string, contractAddress: string) => {
    const contract = await tezos.contract.at(contractAddress);

    return await contract.contractViews.view_owner_stakes(accountPkh).executeView({ viewCaller: accountPkh });
  };

  export const deposit = async (
    tezos: TezosToolkit,
    accountPkh: string,
    contractAddress: string,
    stakeId: BigNumber.Value,
    tokenAmount: BigNumber.Value
  ) => {
    const contract = await tezos.contract.at(contractAddress);

    const params = contract.methods.deposit(new BigNumber(stakeId), new BigNumber(tokenAmount)).toTransferParams();

    const token = await getToken(tezos, contractAddress);

    return await withApproveApi(tezos, contractAddress, token, accountPkh, tokenAmount, [params]);
  };
}
