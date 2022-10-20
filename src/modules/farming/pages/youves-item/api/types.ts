import { BigMapAbstraction } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

interface TokenInfo {
  id: BigNumber;
  address: string;
}

export interface YouvesFarmStorage {
  administrators: BigMapAbstraction;
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
  stakes: BigMapAbstraction;
  stakes_owner_lookup: BigMapAbstraction;
  total_stake: BigNumber;
}

export interface YouvesFarmStakes {
  stake: BigNumber;
  disc_factor: BigNumber;
  age_timestamp: Date;
}
