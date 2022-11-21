import { TezosToolkit } from '@taquito/taquito';

import { getStorageInfo } from '@shared/dapp';
import { TokensValue } from '@shared/types';

export namespace BlockchainLiquidityV3Api {
  export interface V3PoolStorage {
    storage: {
      constants: {
        ctez_burn_fee_bps: number;
        dev_fee_bps: number;
        factory_address: string;
        fee_bps: number;
        tick_spacing: number;
        token_x: TokensValue;
        token_y: TokensValue;
      };
    };
  }

  export const getPoolContract = async (tezos: TezosToolkit, contractAddress: string) => {
    if (!contractAddress) {
      throw Error('contractAddress is required');
    }

    const storage = await getStorageInfo<V3PoolStorage>(tezos, contractAddress);
    // eslint-disable-next-line no-console
    console.log('storage', storage);

    return storage;
  };
}
