import { useCallback, useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';

import { networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { StakeItem } from '@interfaces/staking';
import { useAccountPkh, useOnBlock, useTezos } from '@utils/dapp';
import { Nullable, StakerType, StakingSingleToken, TokenPair } from '@utils/types';

import { useStakingRouter } from '../hooks';
import { StakingTabs } from '../types';

interface Props {
  data: Nullable<StakeItem>;
}

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
const useStakingService = ({ data }: Props) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [rewards, setRewards] = useState<Nullable<string>>(null);
  const [staker, setStaker] = useState<StakerType>(initialStaker);

  const rawStakingId = data?.id;
  const stakingId = useMemo(() => (rawStakingId ? new BigNumber(rawStakingId) : null), [rawStakingId]);

  const tokenOrPair = useMemo<StakingSingleToken | TokenPair>(() => {
    if (data?.tokenB) {
      return {
        token1: data.tokenA,
        token2: data.tokenB,
        balance: data.myBalance?.toFixed(),
        frozenBalance: data.depositBalance?.toFixed()
      };
    }

    return data
      ? { token: data.tokenA, balance: data.myBalance?.toFixed(), frozenBalance: data.depositBalance?.toFixed() }
      : fallbackTokenPair;
  }, [data]);

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

  const localAvailableBalance = currentTab.id === StakingTabs.stake ? tokenOrPair?.balance : tokenOrPair?.frozenBalance;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const getBalances = useCallback(async () => {}, []);

  useEffect(() => {
    if (initialLoad && tokenOrPair) {
      void getBalances();
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh]);

  const updateBalances = useCallback(() => {
    if (tezos && tokenOrPair) {
      getBalances();
    }
  }, [tezos, tokenOrPair, getBalances]);

  useOnBlock(tezos, updateBalances);

  const isStakingLoading = !data;

  const availableBalance = isStakingLoading ? null : localAvailableBalance;

  return {
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

    stakingId,

    availableBalances: {
      availableStakeBalance: data?.myBalance,
      availableUnstakeBalance: data?.depositBalance,
      availableBalance
    },

    tokenOrPair,

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

  useRewards,
  useStaker,

  useStakingId,

  useAvailableBalances,

  useTokenOrPair,

  useStakingRouting,
  useStakingHandlers,

  useStakingLoading
] = constate(
  useStakingService,

  v => v.rewards,
  v => v.staker,

  v => v.stakingId,

  v => v.availableBalances,

  v => v.tokenOrPair,

  v => v.stakingRouting,
  v => v.handlers,

  v => v.stakingLoading
);
