import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import constate from 'constate';

import { networksDefaultTokens, NETWORK, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { useToasts } from '@hooks/use-toasts';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { useAccountPkh, useOnBlock, useSearchCustomTokens, useTezos, useTokens } from '@utils/dapp';
import { handleSearchToken, isEmptyArray, isExist, isNull, isTokenEqual } from '@utils/helpers';
import { Nullable, VoterType, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { useVotingRouter } from '../hooks';
import { VotingTabs } from '../tabs.enum';
import { getVoteVetoBalances } from './get-voting-balance';
import { handleTokenPairSelect, HandleTokenPairSelectReturnType } from './handle-token-pair-select';

const initialVoter: VoterType = {
  vote: null,
  veto: null,
  candidate: null
};

const defaultToken = networksDefaultTokens[NETWORK_ID];

const fallbackTokenPair: WhitelistedTokenPair = {
  token1: TEZOS_TOKEN,
  token2: defaultToken,
  balance: null,
  frozenBalance: null
};
// eslint-disable-next-line sonarjs/cognitive-complexity
const useVotingService = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { showErrorToast } = useToasts();

  const { data: tokens } = useTokens();
  const searchCustomToken = useSearchCustomTokens();

  const exchangeRates = useExchangeRates();

  const [isTokenChanging, setIsTokenChanging] = useState(false);

  const [rewards, setRewards] = useState<Nullable<string>>(null);
  const [voter, setVoter] = useState<VoterType>(initialVoter);

  const [dex, setDex] = useState<Nullable<FoundDex>>(null);

  const [tokenPair, setTokenPair] = useState<WhitelistedTokenPair>(fallbackTokenPair);
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, defaultToken]);
  const tokensRef = useRef<[WhitelistedToken, WhitelistedToken]>([token1, token2]);

  const {
    urlLoaded,
    setUrlLoaded,
    initialLoad,
    setInitialLoad,
    from,
    to,
    tabsState,
    currentTab,
    setTabsState,
    handleSetActiveId
  } = useVotingRouter(token1, token2);

  const { availableVoteBalance, availableVetoBalance } = useMemo(
    () => getVoteVetoBalances(tokenPair, voter),
    [tokenPair, voter]
  );

  useEffect(() => {
    tokensRef.current = [token1, token2];
  }, [token1, token2]);

  const localAvailableBalance = currentTab.id === VotingTabs.vote ? availableVoteBalance : availableVetoBalance;

  const dataSetter = (data: Nullable<HandleTokenPairSelectReturnType>) => {
    if (isExist(data)) {
      const { tokenPair, rewards, dex, voter } = data;

      const [token1, token2] = tokensRef.current;

      if (isTokenEqual(tokenPair.token1, token1) && isTokenEqual(tokenPair.token2, token2)) {
        setRewards(rewards);
        setDex(dex);
        setVoter(voter);
        setTokenPair(tokenPair);
      }
    }
  };

  const tokenPairSelect = useCallback(
    async (pair: WhitelistedTokenPair) => {
      handleTokenPairSelect(pair, setTokenPair, showErrorToast, tezos, accountPkh, NETWORK_ID).then(dataSetter);
    },
    [tezos, accountPkh, showErrorToast]
  );

  const handleTokenPairSelectChange = (pair: WhitelistedTokenPair) => {
    setTokens([pair.token1, pair.token2]);
    tokenPairSelect(pair);
  };

  const getBalances = useCallback(async () => tokenPairSelect(tokenPair), [tokenPairSelect, tokenPair]);

  useEffect(() => {
    if (from && to && !initialLoad && !isEmptyArray(tokens) && exchangeRates) {
      void handleSearchToken({
        tokens,
        tezos: tezos!,
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
    // eslint-disable-next-line
  }, [from, to, initialLoad, tokens, exchangeRates]);

  useEffect(() => {
    if (initialLoad && token1 && token2) {
      void getBalances();
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh]);

  const updateBalances = useCallback(() => {
    if (tezos && tokenPair.token1 && tokenPair.token2) {
      getBalances();
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
      tabsState,
      currentTab,
      setTabsState,
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
