import { FoundDex } from '@quipuswap/sdk';

import { Nullable, WhitelistedBaker } from '@interfaces/types';

export interface CandidateInfo {
  currentCandidate: Nullable<WhitelistedBaker>;
  secondCandidate: Nullable<WhitelistedBaker>;
}

export const getCandidateInfo = (dex: Nullable<FoundDex>, bakers: Array<WhitelistedBaker>): CandidateInfo => {
  if (!dex?.storage?.storage) {
    return {
      currentCandidate: null,
      secondCandidate: null
    };
  }
  const { current_delegated, current_candidate } = dex.storage.storage;

  const emptyCurrentDelegated = { address: current_delegated };
  const emptyCurrentCandidate = { address: current_candidate };

  const currentCandidate = bakers.find(baker => baker.address === current_delegated) || emptyCurrentDelegated;

  const secondCandidate = bakers.find(baker => baker.address === current_candidate) || emptyCurrentCandidate;

  return {
    currentCandidate,
    secondCandidate
  };
};
