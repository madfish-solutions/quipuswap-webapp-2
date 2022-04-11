import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import constate from 'constate';

import { NETWORK } from '@config/config';
import { NETWORK_ID } from '@config/enviroment';
import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useVotingRouter } from '@modules/voting/hooks';
import { VotingTabs } from '@modules/voting/tabs.enum';
import { useTokens, useSearchCustomTokens } from '@providers/dapp-tokens';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, handleSearchToken, isEmptyArray, isExist, isNull, isTokenEqual } from '@shared/helpers';
import { isEqualTokenPairs } from '@shared/helpers/token-pair';
import { useOnBlock, useToasts } from '@shared/hooks';
import { useExchangeRates } from '@shared/hooks/use-exchange-rate';
import { Nullable, VoterType, Token, TokenPair } from '@shared/types';

import { getVoteVetoBalances } from './get-voting-balance';
import { handleTokenPairSelect, HandleTokenPairSelectReturnType } from './handle-token-pair-select';

const initialVoter: VoterType = {
  vote: null,
  veto: null,
  candidate: null
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const useVotingService = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { showErrorToast } = useToasts();

  const { data: tokens } = useTokens();
  const searchCustomToken = useSearchCustomTokens();

  const exchangeRates = useExchangeRates();

  const [isTokenChanging, setIsTokenChanging] = useState(true);

  const [rewards, setRewards] = useState<Nullable<string>>(null);
  const [voter, setVoter] = useState<VoterType>(initialVoter);

  const [dex, setDex] = useState<Nullable<FoundDex>>(null);

  const [tokenPair, setTokenPair] = useState<Nullable<TokenPair>>(null);
  const [[token1, token2], setTokens] = useState<Token[]>([TEZOS_TOKEN, DEFAULT_TOKEN]);
  const tokensRef = useRef<[Token, Token]>([token1, token2]);

  const {
    urlLoaded,
    setUrlLoaded,
    initialLoad,
    setInitialLoad,
    from,
    to,
    votingTab,
    currentTab,
    setVotingTab,
    handleSetActiveId
  } = useVotingRouter(token1, token2);

  const { availableVoteBalance, availableVetoBalance } = useMemo(
    () =>
      tokenPair ? getVoteVetoBalances(tokenPair, voter) : { availableVoteBalance: null, availableVetoBalance: null },
    [tokenPair, voter]
  );

  useEffect(() => {
    tokensRef.current = [token1, token2];
  }, [token1, token2]);

  const localAvailableBalance = currentTab.id === VotingTabs.vote ? availableVoteBalance : availableVetoBalance;

  const dataSetter = useCallback(
    (data: Nullable<HandleTokenPairSelectReturnType>) => {
      if (!isExist(data)) {
        return;
      }

      if (
        isTokenEqual(data.tokenPair.token1, tokensRef.current[0]) &&
        isTokenEqual(data.tokenPair.token2, tokensRef.current[1])
      ) {
        if (data.rewards !== rewards) {
          setRewards(data.rewards);
        }
        if (data.dex !== dex) {
          setDex(data.dex);
        }
        if (data.voter !== voter) {
          setVoter(data.voter);
        }
        if (!tokenPair || !isEqualTokenPairs(data.tokenPair, tokenPair)) {
          setTokenPair(data.tokenPair);
        }
      }
    },
    [dex, rewards, tokenPair, voter]
  );

  const _handleTokenPairSelect = useCallback(
    async (pair: TokenPair) => {
      handleTokenPairSelect(pair, setTokenPair, showErrorToast, tezos, accountPkh, NETWORK_ID).then(dataSetter);
    },
    [showErrorToast, tezos, accountPkh, dataSetter]
  );

  const handleTokenPairSelectChange = (pair: TokenPair) => {
    setTokens([pair.token1, pair.token2]);
    void _handleTokenPairSelect(pair);
  };

  const getBalances = useCallback(
    async (_tokenPair: Nullable<TokenPair>) => _tokenPair && _handleTokenPairSelect(_tokenPair),
    [_handleTokenPairSelect]
  );

  useEffect(() => {
    if (from && to && !initialLoad && !isEmptyArray(tokens) && exchangeRates) {
      void handleSearchToken({
        tokens,
        tezos: defined(tezos),
        network: NETWORK,
        from,
        to,
        fixTokenFrom: TEZOS_TOKEN,
        setInitialLoad,
        setUrlLoaded,
        setTokens,
        setTokenPair,
        searchCustomToken
      });
    }
  }, [from, to, initialLoad, tokens, exchangeRates, tezos, setInitialLoad, setUrlLoaded, searchCustomToken]);

  useEffect(() => {
    if (initialLoad && token1 && token2) {
      void getBalances({ token1, token2 });
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh, initialLoad, token1, token2]); //, getBalances

  const updateBalances = useCallback(() => {
    if (tezos && tokenPair?.token1 && tokenPair?.token2) {
      void getBalances(tokenPair);
    }
  }, [tezos, tokenPair, getBalances]);

  useOnBlock(tezos, updateBalances);

  const isVotingLoading = useMemo(() => {
    return !urlLoaded || !initialLoad || isTokenChanging || isNull(dex);
  }, [urlLoaded, initialLoad, isTokenChanging, dex]);

  const availableBalance = isVotingLoading ? null : localAvailableBalance;

  return {
    tokensLoading: {
      isTokenChanging,
      setIsTokenChanging
    },
    rewards: {
      rewards,
      setRewards
    },
    voter: {
      vote: voter?.vote ?? null,
      veto: voter?.veto ?? null,
      candidate: voter?.candidate ?? null,
      setVoter
    },

    dex: {
      dex,
      setDex
    },

    availableBalances: {
      availableVoteBalance,
      availableVetoBalance,
      availableBalance
    },

    tokenPair: {
      tokenPair,
      setTokenPair
    },
    tokens: {
      token1,
      token2,
      setTokens
    },

    votingRouting: {
      urlLoaded,
      setUrlLoaded,
      initialLoad,
      setInitialLoad,
      from,
      to,
      votingTab,
      currentTab,
      setVotingTab,
      handleSetActiveId
    },
    handlers: {
      handleTokenPairSelectChange,
      updateBalances
    },
    votingLoading: {
      isVotingLoading
    }
  };
};

export const [
  VotingProvider,
  useTokensLoading,

  useRewards,
  useVoter,

  useVotingDex,

  useAvailableBalances,

  useTokensPair,
  useVotingTokens,

  useVotingRouting,
  useVotingHandlers,

  useVotingLoading
] = constate(
  useVotingService,
  v => v.tokensLoading,

  v => v.rewards,
  v => v.voter,

  v => v.dex,

  v => v.availableBalances,

  v => v.tokenPair,
  v => v.tokens,

  v => v.votingRouting,
  v => v.handlers,

  v => v.votingLoading
);
