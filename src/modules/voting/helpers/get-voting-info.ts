import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { TEZOS_TOKEN } from '@config/tokens';
import { toReal } from '@shared/helpers';
import { Nullable } from '@shared/types';

export interface VotingInfo {
  totalVotes: string;
  totalVeto: string;
  votesToVeto: string;
}
const ZERO = '0';

export const getVotingInfo = (dex: Nullable<FoundDex>): VotingInfo => {
  if (!dex?.storage?.storage) {
    return {
      totalVotes: '',
      totalVeto: '',
      votesToVeto: ''
    };
  }

  const realTotalVotes = toReal(dex.storage.storage.total_votes, TEZOS_TOKEN.metadata.decimals).toFixed();

  const realTotalVeto = toReal(dex.storage.storage.veto, TEZOS_TOKEN.metadata.decimals).toFixed();

  const realVotesToVetoBN = toReal(
    dex.storage.storage.total_votes.dividedToIntegerBy(3).minus(dex.storage.storage.veto),
    TEZOS_TOKEN.metadata.decimals
  );
  const votesToVeto = BigNumber.maximum(realVotesToVetoBN, ZERO).toFixed();

  return {
    totalVotes: realTotalVotes,
    totalVeto: realTotalVeto,
    votesToVeto
  };
};
