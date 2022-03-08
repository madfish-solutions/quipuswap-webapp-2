import { BigMapAbstraction, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

export interface StakingStorate {
  storage: {
    admin: string;
    baker_registry: string;
    banned_bakers: BigMapAbstraction;
    burner: string;
    candidates: BigMapAbstraction;
    farms: BigMapAbstraction;
    farms_count: BigNumber;
    pending_admin: string;
    qsgov: { token: 'KT1VowcKqZFGhdcDZA3UN1vrjBLmxV5bxgfJ'; id: BigNumber };
    qsgov_lp: string;
    referrers: BigMapAbstraction;
    token_metadata: BigMapAbstraction;
    users_info: BigMapAbstraction;
    votes: BigMapAbstraction;
  };
  t_farm_lambdas: BigMapAbstraction;
}

export interface StakedAmount {
  allowances: Array<TransferParams>;
  claimed: BigNumber;
  earned: BigNumber;
  last_staked: string;
  prev_earned: BigNumber;
  prev_staked: BigNumber;
  staked: BigNumber;
}
