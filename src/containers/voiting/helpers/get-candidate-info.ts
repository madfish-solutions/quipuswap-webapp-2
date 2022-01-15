import { FoundDex } from '@quipuswap/sdk';

import { Nullable, WhitelistedBaker } from '@utils/types';

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

  const currentCandidate = bakers.find(x => x.address === dex.storage.storage.current_candidate) || {
    address: dex.storage.storage.current_candidate
  };

  const secondCandidate = bakers.find(x => x.address === dex.storage.storage.current_delegated) || {
    address: dex.storage.storage.current_delegated
  };

  return {
    currentCandidate,
    secondCandidate
  };
};
