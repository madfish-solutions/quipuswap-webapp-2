import { FoundDex } from '@quipuswap/sdk';

import { unpackOption } from '@shared/helpers';
import { Nullable, WhitelistedBaker, Option } from '@shared/types';
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
  const { current_delegated: _current_delegated, current_candidate: _current_candidate } = dex.storage.storage as {
    current_delegated: Option<string>;
    current_candidate: Option<string>;
  };

  const current_delegated = unpackOption(_current_delegated)!;
  const current_candidate = unpackOption(_current_candidate)!;

  const emptyCurrentDelegated = { address: current_delegated };
  const emptyCurrentCandidate = { address: current_candidate };

  const currentCandidate = bakers.find(baker => baker.address === current_delegated) || emptyCurrentDelegated;

  const secondCandidate = bakers.find(baker => baker.address === current_candidate) || emptyCurrentCandidate;

  return {
    currentCandidate,
    secondCandidate
  };
};
