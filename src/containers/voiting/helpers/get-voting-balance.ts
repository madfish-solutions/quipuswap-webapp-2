import BigNumber from 'bignumber.js';

import { VoterType, WhitelistedTokenPair } from '@utils/types';

export interface VoteVetoBalances {
  availableVoteBalance: string;
  availableVetoBalance: string;
}

export const getVoteVetoBalances = (
  tokenPair: WhitelistedTokenPair,
  { vote }: Pick<VoterType, 'vote'>
): VoteVetoBalances => {
  if (!tokenPair.balance || !tokenPair.frozenBalance) {
    return {
      availableVoteBalance: '0',
      availableVetoBalance: '0'
    };
  }

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
