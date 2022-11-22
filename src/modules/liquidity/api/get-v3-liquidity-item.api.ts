import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getStorageInfo } from '@shared/dapp';
import { TokensValue } from '@shared/types';

export namespace BlockchainLiquidityV3Api {
  export interface V3PoolStorage {
    constants: {
      ctez_burn_fee_bps: BigNumber;
      dev_fee_bps: BigNumber;
      factory_address: BigNumber;
      fee_bps: BigNumber;
      tick_spacing: BigNumber;
      token_x: TokensValue;
      token_y: TokensValue;
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
