import { FoundDex } from '@quipuswap/sdk';
import { TEZOS_TOKEN } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { Nullable } from '@interfaces/types';
import { fromDecimals } from '@utils/helpers';

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

  const totalVotes = fromDecimals(dex.storage.storage.total_votes, TEZOS_TOKEN.metadata.decimals).toFixed();

  const totalVeto = fromDecimals(dex.storage.storage.veto, TEZOS_TOKEN.metadata.decimals).toFixed();

  const votesToVetoBN = fromDecimals(
    dex.storage.storage.total_votes.dividedToIntegerBy(3).minus(dex.storage.storage.veto),
    TEZOS_TOKEN.metadata.decimals
  );
  const votesToVeto = BigNumber.maximum(votesToVetoBN, ZERO).toFixed();

  return {
    totalVotes,
    totalVeto,
    votesToVeto
  };
};
