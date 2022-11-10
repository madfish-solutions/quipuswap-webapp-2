import { BigMapAbstraction, MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { address, BigMap, nat } from '@shared/types';

interface TokenInfo {
  token_id: BigNumber;
  token_address: string;
}

export interface YouvesFarmStorage {
  administrators: MichelsonMap<address, nat>;
  current_rewards: BigNumber;
  deposit_token: TokenInfo;
  deposit_token_is_v2: boolean;
  disc_factor: BigNumber;
  last_rewards: BigNumber;
  last_stake_id: BigNumber;
  max_release_period: BigNumber;
  operators: BigMapAbstraction;
  reward_token: TokenInfo;
  sender: string;
  stakes: BigMap<nat, YouvesFarmStakes>;
  stakes_owner_lookup: BigMap<address, nat[]>;
  total_stake: BigNumber;
}

export interface YouvesFarmStakes {
  stake: BigNumber;
  disc_factor: BigNumber;
  age_timestamp: Date;
}
