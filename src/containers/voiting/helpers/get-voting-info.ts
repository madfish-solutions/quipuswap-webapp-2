import { FoundDex } from '@quipuswap/sdk';
import { TEZOS_TOKEN } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

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

  const votesToVetoBN = fromDecimals(
    dex.storage.storage.total_votes.dividedToIntegerBy(3).minus(dex.storage.storage.veto),
    TEZOS_TOKEN.metadata.decimals
  );

  const votesToVeto = BigNumber.maximum(votesToVetoBN, '0').toFixed();

  return {
    totalVotes,
    totalVeto,
    votesToVeto
  };
};
