import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { DEX_V3_FACTORY_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';
import { bigNumberToString, defined, fillIndexArray, getUniqArray, isEqual, isExist } from '@shared/helpers';
import { address, BigMap, int, nat, TokensValue } from '@shared/types';

export namespace BlockchainLiquidityV3Api {
  interface FeeGrowth {
    x: int;
    y: int;
  }

  export interface V3PoolTick {
    fee_growth_outside: FeeGrowth;
    liqudity_net: int;
    n_positions: nat;
    next: int;
    prev: int;
    seconds_outside: nat;
    seconds_per_liquidity_outside: nat;
    sqrt_price: nat;
    tick_cumulative_outside: nat;
  }

  export interface V3PoolPosition {
    fee_growth_inside_last: FeeGrowth;
    lower_tick_index: int;
    upper_tick_index: int;
    owner: string;
    liquidity: int;
  }

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
    new_position_id: nat;
    positions: BigMap<nat, V3PoolPosition>;
    ticks: BigMap<int, V3PoolTick>;
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

  export const getPositions = async (tezos: TezosToolkit, accountPkh: string, poolId: BigNumber) => {
    const { contractAddress } = await getPool(tezos, poolId);
    const { new_position_id, positions, ticks } = await getStorageInfo<V3PoolStorage>(tezos, contractAddress);
    const allPositionsMap = await positions.getMultipleValues(fillIndexArray(new_position_id.toNumber()));
    const userPositions = [...allPositionsMap.entries()]
      .filter(([, value]) => isExist(value) && isEqual(value.owner, accountPkh))
      .map(([id, position]) => ({
        ...position!,
        id: id as BigNumber
      }));
    const ticksIds = getUniqArray(
      userPositions.map(({ lower_tick_index, upper_tick_index }) => [lower_tick_index, upper_tick_index]).flat(),
      bigNumberToString
    );
    const ticksMap = await ticks.getMultipleValues(ticksIds);

    return userPositions.map(({ lower_tick_index, upper_tick_index, ...rest }) => ({
      ...rest,
      lower_tick: {
        ...defined(ticksMap.get(lower_tick_index), `tick ${lower_tick_index.toFixed()}`),
        id: lower_tick_index
      },
      upper_tick: {
        ...defined(ticksMap.get(upper_tick_index), `tick ${upper_tick_index.toFixed()}`),
        id: upper_tick_index
      }
    }));
  };
}
