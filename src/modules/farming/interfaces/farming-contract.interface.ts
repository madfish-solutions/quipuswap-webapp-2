import { MichelsonMap } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { nat, address, key_hash, bytes, timestamp, BigMap } from '@shared/types';

export interface FarmingContractStorageWrapper {
  storage: FarmingContractStorage;
}

export interface FarmingContractStorage {
  farms: BigMap<nat, FarmsValue>;
  referrers: BigMap<address, address>;
  users_info: BigMap<UsersInfoKey, IRawUsersInfoValue>;
  votes: BigMap<VotesKey, nat>;
  candidates: BigMap<CandidatesKey, key_hash>;
  banned_bakers: BigMap<key_hash, IBannedBakersValue>;
  token_metadata: BigMap<nat, TokenMetadataValue>;
  qsgov: QsGov;
  qsgov_lp: address;
  admin: address;
  pending_admin: address;
  burner: address;
  baker_registry: address;
  farms_count: nat;
}

export interface FarmsValue {
  fees: Fees;
  upd: timestamp;
  stake_params: StakeParams;
  reward_token: RewardToken;
  timelock: nat;
  current_delegated: key_hash;
  next_candidate: key_hash;
  paused: boolean;
  reward_per_second: nat;
  reward_per_share: nat;
  staked: nat;
  claimed: nat;
  start_time: timestamp;
  end_time: timestamp;
  fid: nat;
}

export interface Fees {
  harvest_fee: nat;
  withdrawal_fee: nat;
}

export interface StakeParams {
  staked_token: StakedToken;
  is_v1_lp: boolean;
}

type StakedToken = ContractToken;
type RewardToken = ContractToken;

export type ContractToken = FA12Token | FA2Token;

export interface FA12Token {
  fA12: string;
}

export interface FA2Token {
  fA2: {
    token: string;
    id: BigNumber;
  };
}

export interface QsGov {
  token: address;
  id: nat;
}

export interface TokenMetadataValue {
  token_id: nat;
  token_info: MichelsonMap<string, bytes>;
}

export type UsersInfoKey = [nat, address];

export interface IRawUsersInfoValue {
  last_staked: timestamp;
  staked: nat;
  earned: nat;
  claimed: nat;
  prev_earned: nat;
  prev_staked: nat;
  allowances: address[];
}

export interface IUsersInfoValue {
  last_staked: Date;
  staked: BigNumber;
  earned: BigNumber;
  claimed: BigNumber;
  prev_earned: BigNumber;
  prev_staked: BigNumber;
  allowances: string[];
}

export type VotesKey = [nat, key_hash];

export type CandidatesKey = [nat, address];

export interface IBannedBakersValue {
  period: nat;
  start: timestamp;
}

export interface TzktFarmingUserInfoKey {
  nat: string;
  address: string;
}

export interface TzktFarmingUserInfoValue {
  earned: string;
  staked: string;
  claimed: string;
  allowances: string[];
  last_staked: string;
  prev_earned: string;
  prev_staked: string;
}
