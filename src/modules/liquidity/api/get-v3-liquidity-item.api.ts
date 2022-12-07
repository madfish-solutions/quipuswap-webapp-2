import { MichelsonMapKey } from '@taquito/michelson-encoder';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { DEX_V3_FACTORY_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';
import { bigNumberToString, defined, getUniqArray, isExist } from '@shared/helpers';
import { address, BigMap, int, nat, TokensValue, WithId } from '@shared/types';

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

  type V3PoolPositionWithId = WithId<V3PoolPosition, nat>;

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
    position_ids: BigMap<address, nat[]>;
    ticks: BigMap<int, V3PoolTick>;
  }

  export interface PositionWithTicks extends Omit<V3PoolPosition, 'lower_tick_index' | 'upper_tick_index'> {
    lower_tick: WithId<V3PoolTick, int>;
    upper_tick: WithId<V3PoolTick, int>;
    id: nat;
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

  const getUserPositionsIds = async (contractStorage: V3PoolStorage, accountPkh: string) => {
    const { position_ids } = contractStorage;

    return (await position_ids.get(accountPkh)) ?? [];
  };

  const getPositions = async (contractStorage: V3PoolStorage, ids: BigNumber[]): Promise<V3PoolPositionWithId[]> => {
    const { positions } = contractStorage;

    const positionsMap = await positions.getMultipleValues(ids);

    return Array.from(positionsMap.entries())
      .filter((entry): entry is [MichelsonMapKey, V3PoolPosition] => {
        const [, value] = entry;

        return isExist(value);
      })
      .map(([id, position]) => ({
        ...position,
        id: id as BigNumber
      }));
  };

  const getPositionsTicksMap = async (contractStorage: V3PoolStorage, positions: V3PoolPosition[]) => {
    const ticksIds = getUniqArray(
      positions.map(({ lower_tick_index, upper_tick_index }) => [lower_tick_index, upper_tick_index]).flat(),
      bigNumberToString
    );

    return await contractStorage.ticks.getMultipleValues(ticksIds);
  };

  export const getUserPositionsWithTicks = async (
    tezos: TezosToolkit,
    accountPkh: string,
    poolId: BigNumber
  ): Promise<PositionWithTicks[]> => {
    const { storage: contractStorage } = await getPool(tezos, poolId);
    const userPositionsIds = await getUserPositionsIds(contractStorage, accountPkh);
    const userPositions = await getPositions(contractStorage, userPositionsIds);

    const ticksMap = await getPositionsTicksMap(contractStorage, userPositions);

    return userPositions.map(({ lower_tick_index, upper_tick_index, ...userPosition }) => ({
      ...userPosition,
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
