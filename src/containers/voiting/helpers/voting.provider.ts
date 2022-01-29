import { useState } from 'react';

import constate from 'constate';

import { Nullable, VoterType } from '@utils/types';

const initialVoter: VoterType = {
  vote: null,
  veto: null,
  candidate: null
};

const useVotingService = () => {
  const [isTokenChanging, setisTokenChanging] = useState(false);
  const [rewards, setRewards] = useState<Nullable<string>>(null);
  const [voter, setVoter] = useState<VoterType>(initialVoter);

  return {
    loading: {
      isTokenChanging,
      setisTokenChanging
    },
    rewards: {
      rewards,
      setRewards
    },
    voter: {
      vote: voter.vote,
      veto: voter.veto,
      candidate: voter.candidate,
      setVoter
    }
  };
};

export const [VotingProvider, useTokensLoading, useRewards, useVoter] = constate(
  useVotingService,
  v => v.loading,
  v => v.rewards,
  v => v.voter
);
