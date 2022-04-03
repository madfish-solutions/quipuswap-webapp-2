import BigNumber from 'bignumber.js';

import { isExist, isNull } from '@shared/helpers';
import { Nullable, VoterType, TokenPair } from '@shared/types';

export interface VoteVetoBalances {
  availableVoteBalance: Nullable<string>;
  availableVetoBalance: Nullable<string>;
}

export const getVoteVetoBalances = (tokenPair: TokenPair, voter: Pick<VoterType, 'vote'>): VoteVetoBalances => {
  if (!isExist(voter) || isNull(voter.vote)) {
    return {
      availableVoteBalance: null,
      availableVetoBalance: null
    };
  }

  if (!tokenPair.balance || !tokenPair.frozenBalance) {
    return {
      availableVoteBalance: '0',
      availableVetoBalance: '0'
    };
  }

  const { vote } = voter;

  const availableVoteBalance = new BigNumber(tokenPair.balance)
    .minus(new BigNumber(tokenPair.frozenBalance))
    .plus(new BigNumber(vote ?? '0'))
    .toString();

  const availableVetoBalance = new BigNumber(tokenPair.balance).minus(new BigNumber(vote ?? '0')).toString();

  return {
    availableVoteBalance,
    availableVetoBalance
  };
};
