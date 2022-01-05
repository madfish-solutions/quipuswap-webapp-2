import { FoundDex } from '@quipuswap/sdk';

import { TEZOS_TOKEN } from '@app.config';
import { fromDecimals } from '@utils/helpers';
import { Undefined, WhitelistedBaker } from '@utils/types';

export interface CandidateInfo {
  currentCandidate: Undefined<WhitelistedBaker>;
  secondCandidate: Undefined<WhitelistedBaker>;
}

export interface VoteVetoInfo {
  totalVotes: string;
  totalVeto: string;
  votesToVeto: string;
}

export const getCandidateInfo = (dex: Undefined<FoundDex>, bakers: Array<WhitelistedBaker>): CandidateInfo => {
  if (!dex?.storage?.storage) {
    return {
      currentCandidate: undefined,
      secondCandidate: undefined
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

export const getVeteVetoInfo = (dex: Undefined<FoundDex>): VoteVetoInfo => {
  if (!dex?.storage?.storage) {
    return {
      totalVotes: '',
      totalVeto: '',
      votesToVeto: ''
    };
  }

  const totalVotes = fromDecimals(dex.storage.storage.total_votes, TEZOS_TOKEN.metadata.decimals).toFixed();

  const totalVeto = fromDecimals(dex.storage.storage.veto, TEZOS_TOKEN.metadata.decimals).toFixed();

  const votesToVeto = fromDecimals(dex.storage.storage.total_votes, TEZOS_TOKEN.metadata.decimals)
    .div(3)
    .minus(fromDecimals(dex.storage.storage.veto, TEZOS_TOKEN.metadata.decimals))
    .toFixed(6);

  return {
    totalVotes,
    totalVeto,
    votesToVeto
  };
};
