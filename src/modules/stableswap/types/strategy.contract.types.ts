import { MichelsonMap } from '@taquito/taquito';

import { address, FA12Token, FA2Token, nat } from '@shared/types';

export namespace StrategyContractStorage {
  export interface Root {
    factory: address;
    pool_data: PoolData;
    token_map: MichelsonMap<nat, RootTokenMapValue>;
  }

  export interface PoolData {
    pool_contract: address;
    pool_id: nat;
    token_map: MichelsonMap<nat, PoolDataTokenMapValue>;
  }

  export type PoolDataTokenMapValue = FA12Token | FA2Token;

  export interface RootTokenMapValue {
    lending_market_id: nat;
    desired_reserves_rate_f: nat;
    delta_rate_f: nat;
    min_invest: nat;
    enabled: boolean;
    invested_tokens: nat;
  }
}
