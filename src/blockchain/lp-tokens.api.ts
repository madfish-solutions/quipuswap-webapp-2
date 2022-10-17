import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { TokensValue } from '@modules/stableswap/types';
import { getStorageInfo } from '@shared/dapp';
import { isExist } from '@shared/helpers';
import { BigMap, nat, TokenAddress } from '@shared/types';

export namespace LpTokensApi {
  export interface IStorage {
    tokens: BigMap<nat, { token_a: TokensValue; token_b: TokensValue }>;
  }
  export interface IStorageResponse {
    storage: IStorage;
  }

  export const getTokens = async (tezos: TezosToolkit, lpToken: TokenAddress) => {
    if (!isExist(lpToken.fa2TokenId)) {
      throw new Error('Token is not FA2');
    }

    const { storage } = await getStorageInfo<IStorageResponse>(tezos, lpToken.contractAddress);

    const map = await storage.tokens.get(new BigNumber(lpToken.fa2TokenId));
    if (!map) {
      throw new Error('Tokens not found');
    }

    return { tokenA: map['token_a'], tokenB: map['token_b'] };
  };
}
