import { FoundDex } from '@quipuswap/sdk';
import { TEZOS_TOKEN } from '@quipuswap/ui-kit';

import { fromDecimals } from '@utils/helpers';
import { Nullable } from '@utils/types';

export interface VotingInfo {
  totalVotes: string;
  totalVeto: string;
  votesToVeto: string;
}

export const getVotingInfo = (dex: Nullable<FoundDex>): VotingInfo => {
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
