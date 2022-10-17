import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { YOUVES_BASED_CONTRACT } from '@config/constants';
import { getStorageInfo } from '@shared/dapp';
import { TokenAddress } from '@shared/types';

export namespace YouvesFarmingApi {
  export interface IFarmingStorage {
    deposit_token: {
      id: BigNumber;
      address: string;
    };
  }

  export const getToken = async (tezos: TezosToolkit): Promise<TokenAddress> => {
    const storage = await getStorageInfo<IFarmingStorage>(tezos, YOUVES_BASED_CONTRACT);
    const { id, address } = storage.deposit_token;

    return {
      fa2TokenId: id.toNumber(),
      contractAddress: address
    };
  };

  export const getStakes = async (tezos: TezosToolkit, accountPkh: string) => {
    const contract = await tezos.contract.at(YOUVES_BASED_CONTRACT);

    const response = await contract.contractViews.view_owner_stakes(accountPkh).executeView({ viewCaller: accountPkh });

    // eslint-disable-next-line no-console
    console.log('response', response);

    return null;
  };

  export const deposit = async (
    tezos: TezosToolkit,
    accountPkh: string,
    stakeId: BigNumber.Value,
    tokenAmount: BigNumber.Value
  ) => {
    const contract = await tezos.contract.at(YOUVES_BASED_CONTRACT);

    const params = contract.methods.deposit(new BigNumber(stakeId), new BigNumber(tokenAmount)).toTransferParams();

    const token = await getToken(tezos);

    return await withApproveApi(tezos, YOUVES_BASED_CONTRACT, token, accountPkh, tokenAmount, [params]);
  };
}
