import { BigMap, nat } from '@shared/types';

interface DexTwoPool {
  token_a_pool: nat;
  token_b_pool: nat;
  token_a_price_cml: nat;
  token_b_price_cml: nat;
  total_supply: nat;
  last_block_timestamp: Date | string;
  bucket: Nullable<string>;
}

export interface BucketContractStorage {
  previous_delegated: string;
  current_delegated: string;
  next_candidate: string;
}

export interface DexTwoContractStorage {
  storage: {
    pairs: BigMap<nat, DexTwoPool>;
  };
}
