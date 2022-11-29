import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { DEX_V3_FACTORY_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';
import { defined } from '@shared/helpers';
import { address, BigMap, int, nat, TokensValue } from '@shared/types';

export namespace BlockchainLiquidityV3Api {
  export interface V3PoolStorage {
    constants: {
      ctez_burn_fee_bps: nat;
      dev_fee_bps: nat;
      factory_address: nat;
      fee_bps: nat;
      tick_spacing: nat;
      token_x: TokensValue;
      token_y: TokensValue;
    };
    sqrt_price: nat;
    liquidity: nat;
    cur_tick_index: int;
  }

  interface V3FactoryStorage {
    pools: BigMap<nat, address>;
  }

  export const getPool = async (tezos: TezosToolkit, id: BigNumber) => {
    const factoryStorage = await getStorageInfo<V3FactoryStorage>(tezos, DEX_V3_FACTORY_ADDRESS);
    const contractAddress = defined(await factoryStorage.pools.get(id), 'contractAddress');

    return {
      contractAddress,
      storage: await getStorageInfo<V3PoolStorage>(tezos, contractAddress)
    };
  };
}
