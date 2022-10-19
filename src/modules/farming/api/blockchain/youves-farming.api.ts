import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { getStorageInfo } from '@shared/dapp';
import { Standard, TokenIdFa2 } from '@shared/types';

interface IFarmingStorage {
  deposit_token: {
    id: BigNumber;
    address: string;
  };
}

export class YouvesFarmingApi {
  static async getToken(tezos: TezosToolkit, contractAddress: string): Promise<TokenIdFa2> {
    const storage = await getStorageInfo<IFarmingStorage>(tezos, contractAddress);
    const { id, address } = storage.deposit_token;

    return {
      type: Standard.Fa2,
      fa2TokenId: id.toNumber(),
      contractAddress: address
    };
  }

  static async getStakesIds(tezos: TezosToolkit, accountPkh: string, contractAddress: string) {
    const contract = await tezos.contract.at(contractAddress);

    return await contract.contractViews.view_owner_stakes(accountPkh).executeView({ viewCaller: accountPkh });
  }

  static async getStakeById(tezos: TezosToolkit, stakeId: BigNumber, accountPkh: string, contractAddress: string) {
    const contract = await tezos.contract.at(contractAddress);

    return await contract.contractViews.view_stake(stakeId).executeView({ viewCaller: accountPkh });
  }

  static async getYouvesFarmingItem(farmAddress: string) {
    // TODO: fetch data from real backend
    return {
      item: {
        address: farmAddress,
        apr: '365',
        depositExchangeRate: '3',
        depositTokenUrl: 'https://ghostnet.tzkt.io',
        discFactor: '1000000000000000000',
        earnExchangeRate: '1.5',
        vestingPeriod: '1048576',
        stakeUrl: 'https://ghostnet.tzkt.io',
        stakedToken: {
          type: 'FA2',
          isWhitelisted: true,
          metadata: {
            decimals: 6,
            symbol: 'QPT',
            name: 'Quipuswap Pool Token',
            thumbnailUri: 'https://quipuswap.com/QPLP.png'
          },
          contractAddress: 'KT1GPJDTf8GZspCcanaG2KhMvGu3NJRqurat',
          fa2TokenId: 0
        },
        tokens: [
          {
            type: 'FA12',
            contractAddress: 'KT1GG8Zd5rUp1XV8nMPRBY2tSyVn6NR5F4Q1',
            metadata: {
              decimals: 18,
              symbol: 'KUSD',
              name: 'Kolibri',
              thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png'
            }
          },
          {
            type: 'FA12',
            contractAddress: 'tez',
            metadata: {
              decimals: 6,
              name: 'Tezos',
              symbol: 'TEZ',
              thumbnailUri: 'https://cloudflare-ipfs.com/ipfs/Qmf3brydfr8c6CKGUUu73Dd7wfBw66Zbzof5E1BWGeU222'
            }
          }
        ],
        rewardToken: {
          type: 'FA2',
          contractAddress: 'KT19363aZDTjeRyoDkSLZhCk62pS4xfvxo6c',
          fa2TokenId: 0,
          isWhitelisted: true,
          metadata: {
            decimals: 6,
            symbol: 'QUIPU',
            name: 'Quipuswap Governance Token',
            thumbnailUri: 'https://quipuswap.com/tokens/quipu.png'
          }
        },
        staked: '102000000'
      },
      blockInfo: {
        level: 1350486,
        hash: 'BLEDsaArLU5Zi3Gc4ZQsV8vbBGr9iAwt7zFJcuNxLtFG8KF4Dkb',
        timestamp: '2022-10-17T16:07:40Z'
      }
    };
  }

  static async getUserInfo(contractAddress: string, accountPkh: string, tezos: TezosToolkit) {
    const stakesIds = await this.getStakesIds(tezos, accountPkh, contractAddress);

    return {
      stakes: await Promise.all(
        stakesIds.map(async (stakeId: BigNumber) => ({
          id: stakeId,
          ...(await YouvesFarmingApi.getStakeById(tezos, stakeId, accountPkh, contractAddress))
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
}
