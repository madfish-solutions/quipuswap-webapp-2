import { MichelsonMapKey } from '@taquito/michelson-encoder';
import { BigMapAbstraction, TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { withWtezBurnOnOutput } from '@blockchain';
import {
  DEFAULT_EXTRA_SLOTS,
  LIQUIDITY_V3_ITEM_API_URL,
  QUIPUSWAP_REFERRAL_CODE,
  ZERO_AMOUNT_BN
} from '@config/constants';
import { DEX_V3_FACTORY_ADDRESS } from '@config/environment';
import { WTEZ_TOKEN } from '@config/tokens';
import { jsonFetch } from '@shared/api';
import { getContract, getStorageInfo } from '@shared/dapp';
import {
  bigNumberToString,
  defined,
  getUniqArray,
  getWalletContract,
  isExist,
  getTransactionDeadline,
  isTezosToken
} from '@shared/helpers';
import { mapTokensValue } from '@shared/mapping/map-token-value';
import { address, BigMap, int, nat, Token, TokensValue, WithId } from '@shared/types';

import { FeeGrowth } from '../../types';

export namespace V3LiquidityPoolApi {
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
    cur_tick_index: int;
    fee_growth: FeeGrowth;
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

  export interface V3FactoryStorage {
    dev_fee_bps: BigNumber;
    owner: string;
    pool_count: BigNumber;
    pool_ids: BigMapAbstraction;
    pools: BigMapAbstraction;
  }

  interface V3PartialFactoryStorage {
    pools: BigMap<nat, address>;
  }

  export const getPool = async (tezos: TezosToolkit, id: BigNumber) => {
    const factoryStorage = await getStorageInfo<V3PartialFactoryStorage>(tezos, DEX_V3_FACTORY_ADDRESS);
    const contractAddress = defined(await factoryStorage.pools.get(id), 'Cannot find pool contract');

    return {
      contractAddress,
      storage: await getStorageInfo<V3PoolStorage>(tezos, contractAddress)
    };
  };

  export const getLiquidityV3Item = async (id: BigNumber) =>
    await jsonFetch(`${LIQUIDITY_V3_ITEM_API_URL}/${id.toFixed()}`);

  export const claimFees = async (
    tezos: TezosToolkit,
    contractAddress: string,
    positionsIds: BigNumber[],
    accountPkh: string,
    transactionDuration: BigNumber,
    mutezToBurn: BigNumber
  ) => {
    const contract = await getContract(tezos, contractAddress);
    const transactionDeadline = await getTransactionDeadline(tezos, transactionDuration);

    return await withWtezBurnOnOutput(
      tezos,
      mutezToBurn,
      accountPkh,
      positionsIds.map(id =>
        contract.methods
          .update_position(
            id,
            ZERO_AMOUNT_BN,
            accountPkh,
            accountPkh,
            transactionDeadline,
            ZERO_AMOUNT_BN,
            ZERO_AMOUNT_BN,
            QUIPUSWAP_REFERRAL_CODE
          )
          .toTransferParams()
      )
    );
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

  export const createPool = async (
    tezos: TezosToolkit,
    tokenX: Token,
    tokenY: Token,
    currentTickIndex: int,
    feeBps: nat,
    tickSpacing: int
  ) => {
    const wrappedTokenX = isTezosToken(tokenX) ? WTEZ_TOKEN : tokenX;
    const wrappedTokenY = isTezosToken(tokenY) ? WTEZ_TOKEN : tokenY;
    const factoryContract = await getWalletContract(tezos.wallet, DEX_V3_FACTORY_ADDRESS);

    return factoryContract.methodsObject
      .deploy_pool({
        cur_tick_index: currentTickIndex,
        token_x: mapTokensValue(wrappedTokenX),
        token_y: mapTokensValue(wrappedTokenY),
        fee_bps: feeBps,
        tick_spacing: tickSpacing,
        extra_slots: DEFAULT_EXTRA_SLOTS
      })
      .send();
  };
}
