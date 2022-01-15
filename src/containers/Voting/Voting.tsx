import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { FoundDex, TransferParams } from '@quipuswap/sdk';
import { StickyBlock } from '@quipuswap/ui-kit';
import { useRouter } from 'next/router';
import { withTypes } from 'react-final-form';
import { noop } from 'rxjs';

import { MAINNET_DEFAULT_TOKEN, HANGZHOUNET_DEFAULT_TOKEN, TEZOS_TOKEN, HANGZHOUNET_NETWORK } from '@app.config';
import { VotingDetails, VotingStats } from '@containers/voiting/structures';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { useRouterPair } from '@hooks/useRouterPair';
import s from '@styles/CommonContainer.module.sass';
import { useTezos, useTokens, useNetwork, useOnBlock, useAccountPkh, useSearchCustomTokens } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { handleSearchToken, handleTokenChange, fallbackTokenToTokenData } from '@utils/helpers';
import { VoterType, TokenDataMap, VoteFormValues, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { handleTokenPairSelect, submitForm, submitWithdraw } from './helpers/votingHelpers';
import { useVotingToast } from './useVotingToast';
import { VotingForm } from './VotingForm';

const TabsContent = [
  {
    id: 'vote',
    label: 'Vote'
  },
  {
    id: 'veto',
    label: 'Veto'
  }
];

interface VotingProps {
  className?: string;
}

const fallbackTokenPair: WhitelistedTokenPair = {
  token1: TEZOS_TOKEN,
  token2: MAINNET_DEFAULT_TOKEN
};

export const Voting: React.FC<VotingProps> = ({ className }) => {
  const { handleErrorToast } = useVotingToast();
  const confirmOperation = useConfirmOperation();
  const tezos = useTezos();
  const network = useNetwork();
  const exchangeRates = useExchangeRates();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const searchCustomToken = useSearchCustomTokens();
  const [tokensData, setTokensData] = useState<TokenDataMap>({
    first: fallbackTokenToTokenData(TEZOS_TOKEN),
    second: fallbackTokenToTokenData(MAINNET_DEFAULT_TOKEN)
  });
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, MAINNET_DEFAULT_TOKEN]);
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
    token2: tokenPair.token2
  });

  const currentTab = useMemo(() => TabsContent.find(({ id }) => id === tabsState)!, [tabsState]);

  const handleTokenChangeWrapper = async (token: WhitelistedToken, tokenNumber: 'first' | 'second') =>
    handleTokenChange({
      token,
      tokenNumber,
      // @ts-ignore
      exchangeRates,
      tezos: tezos!,
      accountPkh: accountPkh!,
      setTokensData
    });

  useEffect(() => {
    if (network.id === HANGZHOUNET_NETWORK.id) {
      setTokenPair({
        token1: TEZOS_TOKEN,
        token2: HANGZHOUNET_DEFAULT_TOKEN
      });
    } else {
      setTokenPair(fallbackTokenPair);
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
        handleTokenChangeWrapper
      });
    }
    // eslint-disable-next-line
  }, [from, to, initialLoad, tokens, exchangeRates]);

  const getBalance = useCallback(() => {
    if (tezos && tokenPair.token1 && tokenPair.token2) {
      handleTokenChangeWrapper(tokenPair.token1, 'first');
      handleTokenChangeWrapper(tokenPair.token2, 'second');
      handleTokenPairSelect(
        tokenPair,
        setTokenPair,
        setDex,
        setRewards,
        setVoter,
        handleErrorToast,
        tezos,
        accountPkh,
        network.id
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
        pendingReward={accountPkh ? rewards : '0'}
        balanceAmount={tokenPair.balance || null}
        voteAmount={voter?.vote || null}
        vetoAmount={voter?.veto || null}
        className={s.votingStats}
        dex={dex}
        handleSubmit={(params: TransferParams[]) => {
          if (!tezos) {
            return;
          }

          return submitWithdraw(tezos, params, handleErrorToast, confirmOperation, getBalance);
        }}
      />
      <StickyBlock className={className}>
        <Form
          onSubmit={values => {
            if (!tezos) {
              return;
            }
            void submitForm({
              tezos,
              values,
              dex,
              tab: currentTab.id,
              confirmOperation,
              handleErrorToast,
              getBalance
            });
          }}
          mutators={{
            setValue: ([field, value], state, { changeValue }) => {
              changeValue(state, field, () => value);
            }
          }}
          render={({ handleSubmit, form }) => (
            <VotingForm
              form={form}
              handleSubmit={handleSubmit}
              debounce={100}
              save={noop}
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

        <VotingDetails tokenPair={tokenPair} dex={dex} voter={voter} />
      </StickyBlock>
    </>
  );
};
