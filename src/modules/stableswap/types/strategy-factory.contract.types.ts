import { address, BigMap, nat, Optional } from '@shared/types';

export namespace StrategyFactoryContractStorage {
  export interface Root {
    dev: Dev;
    lending_contract: address;
    deployed_strategies: BigMap<DeployedStrategiesKey, address>;
    connected_pools: BigMap<address, ConnectedPoolsValue>;
  }
  export interface Dev {
    dev_address: address;
    temp_dev_address: Optional<address>;
  }
  export interface DeployedStrategiesKey {
    pool_contract: address;
    pool_id: nat;
  }
  export interface ConnectedPoolsValue {
    pool_contract: address;
    pool_id: nat;
  }
}
