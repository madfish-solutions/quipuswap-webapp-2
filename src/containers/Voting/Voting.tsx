import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import { FoundDex, TransferParams } from '@quipuswap/sdk';
import { StickyBlock } from '@quipuswap/ui-kit';
import { withTypes } from 'react-final-form';
import { useRouter } from 'next/router';

import {
  handleSearchToken,
  handleTokenChange,
  fallbackTokenToTokenData,
} from '@utils/helpers';
import {
  useTezos,
  useTokens,
  useNetwork,
  useOnBlock,
  useAccountPkh,
  useSearchCustomTokens,
} from '@utils/dapp';
import {
  VoterType,
  TokenDataMap,
  VoteFormValues,
  WhitelistedToken,
  WhitelistedTokenPair,
} from '@utils/types';
import {
  STABLE_TOKEN,
  STABLE_TOKEN_GRANADA,
  TEZOS_TOKEN,
} from '@utils/defaults';
import { useRouterPair } from '@hooks/useRouterPair';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { VotingStats } from '@components/voting/VotingStats';

import s from '@styles/CommonContainer.module.sass';
import { VotingForm } from './VotingForm';
import {
  hanldeTokenPairSelect,
  submitForm,
  submitWithdraw,
} from './helpers/votingHelpers';
import { useVotingToast } from './useVotingToast';

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
  className?: string;
};

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: STABLE_TOKEN,
} as WhitelistedTokenPair;

export const Voting: React.FC<VotingProps> = ({ className }) => {
  const {
    updateToast, handleErrorToast, handleLoader, handleSuccessToast,
  } = useVotingToast();
  const tezos = useTezos();
  const network = useNetwork();
  const exchangeRates = useExchangeRates();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const searchCustomToken = useSearchCustomTokens();
  const [tokensData, setTokensData] = useState<TokenDataMap>({
    first: fallbackTokenToTokenData(TEZOS_TOKEN),
    second: fallbackTokenToTokenData(STABLE_TOKEN),
  });
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([
    TEZOS_TOKEN,
    STABLE_TOKEN,
  ]);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [dex, setDex] = useState<FoundDex>();
  const { Form } = withTypes<VoteFormValues>();
  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [rewards, setRewards] = useState<string>('0');
  const [voter, setVoter] = useState<VoterType | undefined>();
  const [tokenPair, setTokenPair] = useState<WhitelistedTokenPair>(fallbackTokenPair);
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
    () => TabsContent.find(({ id }) => id === tabsState)!,
    [tabsState],
  );

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
    switch (network.id) {
      case 'hangzhounet':
        setTokenPair({
          token1: TEZOS_TOKEN,
          token2: STABLE_TOKEN_GRANADA,
        } as WhitelistedTokenPair);
        break;
      default:
        setTokenPair(fallbackTokenPair);
        break;
    }
  }, [network]);

  useEffect(() => {
    if (from && to && !initialLoad && tokens.length > 0 && exchangeRates) {
      handleSearchToken({
        tokens,
        tezos: tezos!,
        network,
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
    // eslint-disable-next-line
  }, [from, to, initialLoad, tokens, exchangeRates]);

  const getBalance = useCallback(() => {
    if (tezos && tokenPair.token1 && tokenPair.token2) {
      handleTokenChangeWrapper(tokenPair.token1, 'first');
      handleTokenChangeWrapper(tokenPair.token2, 'second');
      hanldeTokenPairSelect(
        tokenPair,
        setTokenPair,
        setDex,
        setRewards,
        setVoter,
        handleErrorToast,
        tezos,
        accountPkh,
        network.id,
      );
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh, network.id, tokenPair]);

  useEffect(() => {
    if (initialLoad && token1 && token2) {
      getBalance();
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh, network.id]);

  useOnBlock(tezos, getBalance);

  return (
    <>
      <VotingStats
        pendingReward={rewards}
        amounts={[
          tokenPair.balance ?? '0',
          voter?.vote?.toFixed() ?? '0',
          voter?.veto?.toFixed() ?? '0',
        ]}
        className={s.votingStats}
        dex={dex}
        handleSubmit={(params: TransferParams[]) => {
          if (!tezos) return;
          handleLoader();
          submitWithdraw(
            tezos,
            params,
            handleErrorToast,
            handleSuccessToast,
            getBalance,
          );
        }}
      />
      <StickyBlock className={className}>
        <Form
          onSubmit={(values) => {
            if (!tezos) return;
            handleLoader();
            submitForm({
              tezos,
              values,
              dex,
              tab: currentTab.id,
              updateToast,
              handleErrorToast,
              getBalance,
            });
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
              save={() => {}}
              setTabsState={setTabsState}
              tabsState={tabsState}
              rewards={rewards}
              setRewards={setRewards}
              voter={voter}
              dex={dex}
              setDex={setDex}
              setVoter={setVoter}
              setTokens={setTokens}
              tokenPair={tokenPair}
              setTokenPair={setTokenPair}
              tokensData={tokensData}
              handleTokenChange={handleTokenChange}
              currentTab={currentTab}
              getBalance={getBalance}
            />
          )}
        />
      </StickyBlock>
    </>
  );
};
