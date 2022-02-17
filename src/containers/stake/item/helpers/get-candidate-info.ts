import BigNumber from 'bignumber.js';

import { Nullable, WhitelistedBaker } from '@utils/types';

export interface CandidateInfo {
  currentCandidate: Nullable<WhitelistedBaker>;
  secondCandidate: Nullable<WhitelistedBaker>;
}

export const getCandidateInfo = (_stakingId: BigNumber, bakers: Array<WhitelistedBaker>): CandidateInfo => {
  return {
    currentCandidate: bakers[0],
    secondCandidate: bakers[1]
  };
};
