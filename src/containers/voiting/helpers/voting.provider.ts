import { useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import constate from 'constate';

import { networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { fallbackTokenToTokenData, handleTokenChange, TokenNumber } from '@utils/helpers';
import { Nullable, TokenDataMap, VoterType, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { useVotingRouter } from '../hooks/use-voting-router';

const initialVoter: VoterType = {
  vote: null,
  veto: null,
  candidate: null
};

const defaultToken = networksDefaultTokens[NETWORK_ID];

const fallbackTokenPair: WhitelistedTokenPair = {
  token1: TEZOS_TOKEN,
  token2: defaultToken
};

const useVotingService = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [isTokenChanging, setisTokenChanging] = useState(false);

  const [rewards, setRewards] = useState<Nullable<string>>(null);
  const [voter, setVoter] = useState<VoterType>(initialVoter);

  const [dex, setDex] = useState<Nullable<FoundDex>>(null);

  const [tokenPair, setTokenPair] = useState<WhitelistedTokenPair>(fallbackTokenPair);
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, defaultToken]);
  const [tokensData, setTokensData] = useState<TokenDataMap>({
    first: fallbackTokenToTokenData(TEZOS_TOKEN),
    second: fallbackTokenToTokenData(defaultToken)
  });

  const votingRouting = useVotingRouter(tokenPair);

  const exchangeRates = useExchangeRates();

  const handleTokenChangeWrapper = async (token: WhitelistedToken, tokenNumber: TokenNumber) => {
    if (!tezos || !accountPkh) {
      return;
    }
    await handleTokenChange({
      token,
      tokenNumber,
      // @ts-ignore
      exchangeRates,
      tezos,
      accountPkh,
      setTokensData
    });
  };

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
    },

    dex: {
      dex,
      setDex
    },

    tokenPair: {
      tokenPair,
      setTokenPair
    },
    tokensData: {
      tokensData,
      setTokensData
    },
    tokens: {
      token1,
      token2,
      setTokens
    },

    votingRouting,
    handlers: {
      handleTokenChangeWrapper
    }
  };
};

export const [
  VotingProvider,
  useTokensLoading,

  useRewards,
  useVoter,

  useVotingDex,

  useTokensPair,
  useTokensData,
  useVotingTokens, //TODO: try to delete

  useVotingRouting,
  useVotingHandlers
] = constate(
  useVotingService,
  v => v.loading,

  v => v.rewards,
  v => v.voter,

  v => v.dex,

  v => v.tokenPair,
  v => v.tokensData,
  v => v.tokens, // TODO: try to delete

  v => v.votingRouting,
  v => v.handlers
);
