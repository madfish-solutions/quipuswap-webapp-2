import { MichelsonMap } from '@taquito/taquito';

import { address, BigMap, nat, timestamp } from '@shared/types';

interface FA12Token {
  fa12: address;
}

interface FA2Token {
  fa2: {
    token_address: address;
    token_id: nat;
  };
}

export type TokensValue = FA12Token | FA2Token;

interface TokensInfoValue {
  rate_f: nat;
  precision_multiplier_f: nat;
  reserves: nat;
}

interface Fee {
  lp_f: nat;
  stakers_f: nat;
  ref_f: nat;
}

export interface StakerAccumulator {
  accumulator_f: MichelsonMap<nat, nat>;
  total_fees: MichelsonMap<nat, nat>;
  total_staked: nat;
}

interface StableswapPoolValue {
  initial_A_f: nat;
  initial_A_time: timestamp;
  future_A_f: nat;
  future_A_time: timestamp;
  tokens_info: MichelsonMap<nat, TokensInfoValue>;
  fee: Fee;
  staker_accumulator: StakerAccumulator;
  total_supply: nat;
}

export interface EarningsValue {
  reward_f: nat;
  former_f: nat;
}

export interface StakersBalanceValue {
  balance: nat;
  earnings: MichelsonMap<nat, EarningsValue>;
}

export interface StableswapStorage {
  storage: {
    pools_count: nat;
    tokens: BigMap<nat, MichelsonMap<nat, TokensValue>>;
    pools: BigMap<nat, StableswapPoolValue>;
    stakers_balance: BigMap<[address, nat], StakersBalanceValue>;
    quipu_token: {
      token_address: address;
      token_id: nat;
    };
  };
}
