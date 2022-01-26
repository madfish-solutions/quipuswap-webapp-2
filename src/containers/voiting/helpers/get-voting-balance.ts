import BigNumber from 'bignumber.js';

import { Undefined, VoterType, WhitelistedTokenPair } from '@utils/types';

export interface VoteVetoBalances {
  availableVoteBalance: string;
  availableVetoBalance: string;
}

export const getVoteVetoBalances = (tokenPair: WhitelistedTokenPair, voter: Undefined<VoterType>): VoteVetoBalances => {
  if (!tokenPair.balance || !tokenPair.frozenBalance || !voter) {
    return {
      availableVoteBalance: '0',
      availableVetoBalance: '0'
    };
  }

  const availableVoteBalance = new BigNumber(tokenPair.balance)
    .minus(new BigNumber(tokenPair.frozenBalance))
    .plus(new BigNumber(voter.vote ?? '0'))
    .toString();

  const availableVetoBalance = new BigNumber(tokenPair.balance).minus(new BigNumber(voter.vote ?? '0')).toString();

  return {
    availableVoteBalance,
    availableVetoBalance
  };
};
