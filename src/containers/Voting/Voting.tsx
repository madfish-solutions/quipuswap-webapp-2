import React, {
  useCallback,
  useEffect,
  useMemo, useState,
} from 'react';
import { withTypes } from 'react-final-form';
import {
  FoundDex,
  TransferParams,
} from '@quipuswap/sdk';
import { useRouter } from 'next/router';

import useUpdateToast from '@hooks/useUpdateToast';
import { useRouterPair } from '@hooks/useRouterPair';
import { useExchangeRates } from '@hooks/useExchangeRate';
import {
  fallbackTokenToTokenData, handleSearchToken, handleTokenChange,
} from '@utils/helpers';
import {
  useAccountPkh,
  useNetwork,
  useOnBlock,
  useSearchCustomTokens,
  useTezos,
  useTokens,
} from '@utils/dapp';
import {
  QSMainNet,
  TokenDataMap,
  VoteFormValues,
  VoterType, WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { VotingStats } from '@components/voting/VotingStats';
import { StickyBlock } from '@components/common/StickyBlock';

import s from '@styles/CommonContainer.module.sass';
import { VotingForm } from './VotingForm';
import { hanldeTokenPairSelect, submitForm, submitWithdraw } from './votingHelpers';

const TabsContent = [
  {
    id: 'vote',
    label: 'Vote',
  },
  {
    id: 'veto',
    label: 'Veto',
  },
];

type VotingProps = {
  className?: string
};

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: STABLE_TOKEN,
} as WhitelistedTokenPair;

export const Voting: React.FC<VotingProps> = ({
  className,
}) => {
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const network = useNetwork();
  const exchangeRates = useExchangeRates();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const searchCustomToken = useSearchCustomTokens();
  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokenToTokenData(TEZOS_TOKEN),
      second: fallbackTokenToTokenData(STABLE_TOKEN),
    },
  );
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, STABLE_TOKEN]);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [voteParams, setVoteParams] = useState<TransferParams[]>([]);
  const [dex, setDex] = useState<FoundDex>();
  const { Form } = withTypes<VoteFormValues>();
  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [rewards, setRewards] = useState('0');
  const [voter, setVoter] = useState<VoterType>();
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);
  const router = useRouter();
  const [tabsState, setTabsState] = useState(router.query.method); // TODO: Change to routes
  const { from, to } = useRouterPair({
    page: `voting/${router.query.method}`,
    urlLoaded,
    initialLoad,
    token1: tokenPair.token1,
    token2: tokenPair.token2,
  });

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: 'Loading',
    });
  }, [updateToast]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: currentTab.id === 'remove' ? 'Divest completed!' : 'Invest completed!',
    });
  }, [updateToast]);

  const handleTokenChangeWrapper = (
    token: WhitelistedToken,
    tokenNumber: 'first' | 'second',
  ) => handleTokenChange({
    token,
    tokenNumber,
    exchangeRates,
    tezos: tezos!,
    accountPkh: accountPkh!,
    setTokensData,
  });

  useEffect(() => {
    if (from && to && !initialLoad && tokens.length > 0 && exchangeRates) {
      handleSearchToken({
        tokens,
        tezos: tezos!,
        network,
        accountPkh: accountPkh!,
        from,
        to,
        fixTokenFrom: TEZOS_TOKEN,
        setInitialLoad,
        setUrlLoaded,
        setTokens,
        setTokenPair,
        searchCustomToken,
        handleTokenChangeWrapper,
      });
    }
  }, [from, to, initialLoad, tokens, exchangeRates]);

  const getBalance = useCallback(() => {
    if (tezos && token1 && token2) {
      handleTokenChangeWrapper(token1, 'first');
      handleTokenChangeWrapper(token2, 'second');
      hanldeTokenPairSelect(
        { token1, token2 } as WhitelistedTokenPair,
        setTokenPair,
        setDex,
        setRewards,
        setVoter,
        tezos,
        accountPkh,
        network.id as QSMainNet,
      );
    }
  }, [tezos, accountPkh, network.id]);

  useEffect(() => {
    getBalance();
  }, [tezos, accountPkh, network.id]);

  useOnBlock(tezos, getBalance);

  return (
    <>
      <VotingStats
        pendingReward={rewards}
        amounts={[tokenPair.balance ?? '', voter?.vote ?? '', voter?.veto ?? '']}
        className={s.votingStats}
        dex={dex}
        handleSubmit={(params:TransferParams[]) => {
          if (!tezos) return;
          handleLoader();
          submitWithdraw(tezos, params, handleErrorToast, handleSuccessToast);
        }}
      />
      <StickyBlock className={className}>
        <Form
          onSubmit={() => {
            if (!tezos) return;
            handleLoader();
            submitForm(tezos, voteParams, handleErrorToast, handleSuccessToast);
          }}
          mutators={{
            setValue: ([field, value], state, { changeValue }) => {
              changeValue(state, field, () => value);
            },
          }}
          render={({ handleSubmit, form }) => (
            <VotingForm
              form={form}
              handleSubmit={handleSubmit}
              debounce={100}
              save={() => { }}
              setTabsState={setTabsState}
              tabsState={tabsState}
              rewards={rewards}
              setRewards={setRewards}
              voter={voter}
              dex={dex}
              setDex={setDex}
              setVoter={setVoter}
              tokenPair={tokenPair}
              setTokenPair={setTokenPair}
              tokensData={tokensData}
              handleTokenChange={handleTokenChange}
              currentTab={currentTab}
              setVoteParams={setVoteParams}
            />
          )}
        />
      </StickyBlock>
    </>
  );
};
