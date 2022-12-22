import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { getContract, getStorageInfo } from '@shared/dapp';
import { getWalletContract } from '@shared/helpers';
import { Standard, TokenIdFa2 } from '@shared/types';

interface IFarmingStorage {
  deposit_token: {
    token_id: BigNumber;
    token_address: string;
  };
}

export class BlockchainYouvesFarmingApi {
  static async getToken(tezos: TezosToolkit, contractAddress: string): Promise<TokenIdFa2> {
    const storage = await getStorageInfo<IFarmingStorage>(tezos, contractAddress);
    const { token_id, token_address } = storage.deposit_token;

    return {
      type: Standard.Fa2,
      fa2TokenId: token_id.toNumber(),
      contractAddress: token_address
    };
  }

  static async getStakesIds(tezos: TezosToolkit, accountPkh: string, contractAddress: string) {
    const contract = await getContract(tezos, contractAddress);

    return await contract.contractViews.view_owner_stakes(accountPkh).executeView({ viewCaller: accountPkh });
  }

  static async getStakeById(tezos: TezosToolkit, accountPkh: string, contractAddress: string, stakeId: BigNumber) {
    const contract = await getContract(tezos, contractAddress);

    return await contract.contractViews.view_stake(stakeId).executeView({ viewCaller: accountPkh });
  }

  static async getStakes(contractAddress: string, accountPkh: string, tezos: TezosToolkit) {
    const stakesIds = await this.getStakesIds(tezos, accountPkh, contractAddress);

    return {
      stakes: await Promise.all(
        stakesIds.map(async (stakeId: BigNumber) => ({
          id: stakeId,
          ...(await BlockchainYouvesFarmingApi.getStakeById(tezos, accountPkh, contractAddress, stakeId))
        }))
      )
    };
  }

  static async deposit(
    tezos: TezosToolkit,
    accountPkh: string,
    contractAddress: string,
    stakeId: BigNumber.Value,
    tokenAmount: BigNumber.Value
  ) {
    const contract = await tezos.contract.at(contractAddress);

    const params = contract.methods.deposit(new BigNumber(stakeId), new BigNumber(tokenAmount)).toTransferParams();

    const token = await this.getToken(tezos, contractAddress);

    return await withApproveApi(tezos, contractAddress, token, accountPkh, tokenAmount, [params]);
  }

  static async harvest(tezos: TezosToolkit, contractAddress: string, stakeId: BigNumber.Value) {
    const contract = await getWalletContract(tezos.wallet, contractAddress);

    return await contract.methods.claim(new BigNumber(stakeId)).send();
  }

  static async withdraw(
    tezos: TezosToolkit,
    accountPkh: string,
    contractAddress: string,
    stakeId: BigNumber.Value,
    balance: BigNumber
  ) {
    const contract = await tezos.contract.at(contractAddress);

    const params = contract.methods.withdraw(new BigNumber(stakeId)).toTransferParams();

    const token = await this.getToken(tezos, contractAddress);

    return await withApproveApi(tezos, contractAddress, token, accountPkh, balance, [params]);
  }
}
