import { BigMapAbstraction } from '@taquito/taquito';

export interface StakingContractStorage {
  storage: {
    candidates: BigMapAbstraction;
    users_info: BigMapAbstraction;
  };
}
