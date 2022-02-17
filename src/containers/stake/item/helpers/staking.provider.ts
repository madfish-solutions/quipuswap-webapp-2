import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';

import { networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { useAccountPkh, useOnBlock, useTezos } from '@utils/dapp';
import { Nullable, StakerType, Token, TokenPair } from '@utils/types';

import { useStakingRouter } from '../hooks';
import { StakingTabs } from '../types';
import { getStakeBalances } from './get-staking-balance';

const initialStaker: StakerType = {
  stake: null,
  unstake: null,
  candidate: null
};

const defaultToken = networksDefaultTokens[NETWORK_ID];

const fallbackTokenPair: TokenPair = {
  token1: TEZOS_TOKEN,
  token2: defaultToken,
  balance: null,
  frozenBalance: null
};
// eslint-disable-next-line sonarjs/cognitive-complexity
const useStakingService = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [isTokenChanging, setIsTokenChanging] = useState(false);

  const [rewards, setRewards] = useState<Nullable<string>>(null);
  const [staker, setStaker] = useState<StakerType>(initialStaker);

  const [stakingId, setStakingId] = useState<BigNumber>(new BigNumber(0));

  const [tokenPair, setTokenPair] = useState<TokenPair>(fallbackTokenPair);
  const [[token1, token2], setTokens] = useState<Token[]>([TEZOS_TOKEN, defaultToken]);
  const tokensRef = useRef<[Token, Token]>([token1, token2]);

  const {
    urlLoaded,
    setUrlLoaded,
    initialLoad,
    setInitialLoad,
    stakingTab,
    currentTab,
    setStakingTab,
    handleSetActiveId
  } = useStakingRouter();

  const { availableStakeBalance, availableUnstakeBalance } = useMemo(() => getStakeBalances(), []);

  useEffect(() => {
    tokensRef.current = [token1, token2];
  }, [token1, token2]);

  const localAvailableBalance = currentTab.id === StakingTabs.stake ? availableStakeBalance : availableUnstakeBalance;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const getBalances = useCallback(async () => {}, []);

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

  const isStakingLoading = useMemo(() => {
    return !urlLoaded || !initialLoad || isTokenChanging;
  }, [urlLoaded, initialLoad, isTokenChanging]);

  const availableBalance = isStakingLoading ? null : localAvailableBalance;

  return {
    tokensLoading: {
      isTokenChanging,
      setIsTokenChanging
    },
    rewards: {
      rewards,
      setRewards
    },
    staker: {
      stake: staker?.stake ?? null,
      unstake: staker?.unstake ?? null,
      candidate: staker?.candidate ?? null,
      setStaker
    },

    stakingId: {
      stakingId,
      setStakingId
    },

    availableBalances: {
      availableStakeBalance,
      availableUnstakeBalance,
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

    stakingRouting: {
      urlLoaded,
      setUrlLoaded,
      initialLoad,
      setInitialLoad,
      stakingTab,
      currentTab,
      setStakingTab,
      handleSetActiveId
    },
    handlers: {
      updateBalances
    },
    stakingLoading: {
      isStakingLoading
    }
  };
};

export const [
  StakingProvider,
  useTokensLoading,

  useRewards,
  useStaker,

  useStakingId,

  useAvailableBalances,

  useTokensPair,
  useStakingTokens,

  useStakingRouting,
  useStakingHandlers,

  useStakingLoading
] = constate(
  useStakingService,
  v => v.tokensLoading,

  v => v.rewards,
  v => v.staker,

  v => v.stakingId,

  v => v.availableBalances,

  v => v.tokenPair,
  v => v.tokens,

  v => v.stakingRouting,
  v => v.handlers,

  v => v.stakingLoading
);
