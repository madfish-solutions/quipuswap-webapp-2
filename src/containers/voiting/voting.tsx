import React, { useMemo, useState, useEffect, useCallback, Fragment } from 'react';

import { FoundDex, TransferParams } from '@quipuswap/sdk';
import { StickyBlock } from '@quipuswap/ui-kit';
import { useRouter } from 'next/router';
import { withTypes } from 'react-final-form';
import { noop } from 'rxjs';

import { TEZOS_TOKEN, networksDefaultTokens, NETWORK_ID, NETWORK } from '@app.config';
import { useToasts } from '@hooks/use-toasts';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { useRouterPair } from '@hooks/useRouterPair';
import s from '@styles/CommonContainer.module.sass';
import { useTezos, useOnBlock, useAccountPkh, useSearchCustomTokens, useTokens } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { handleSearchToken, handleTokenChange, fallbackTokenToTokenData } from '@utils/helpers';
import {
  VoterType,
  TokenDataMap,
  VoteFormValues,
  WhitelistedToken,
  WhitelistedTokenPair,
  Nullable
} from '@utils/types';

import { handleTokenPairSelect, submitForm, submitWithdraw } from './helpers';
import { VotingDetails, VotingForm, VotingStats } from './structures';
import { VotingTabs } from './tabs.enum';

const TabsContent = [
  {
    id: VotingTabs.vote,
    label: 'Vote'
  },
  {
    id: VotingTabs.veto,
    label: 'Veto'
  }
];

interface VotingProps {
  className?: string;
}

const defaultToken = networksDefaultTokens[NETWORK_ID];

const fallbackTokenPair: WhitelistedTokenPair = {
  token1: TEZOS_TOKEN,
  token2: defaultToken
};

export const Voting: React.FC<VotingProps> = ({ className }) => {
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const tezos = useTezos();
  const exchangeRates = useExchangeRates();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const searchCustomToken = useSearchCustomTokens();
  const [tokensData, setTokensData] = useState<TokenDataMap>({
    first: fallbackTokenToTokenData(TEZOS_TOKEN),
    second: fallbackTokenToTokenData(defaultToken)
  });
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, defaultToken]);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [dex, setDex] = useState<Nullable<FoundDex>>(null);
  const { Form } = withTypes<VoteFormValues>();
  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [rewards, setRewards] = useState<string>('0');
  const [voter, setVoter] = useState<Nullable<VoterType>>(null);
  const [tokenPair, setTokenPair] = useState<WhitelistedTokenPair>(fallbackTokenPair);
  const router = useRouter();
  const [tabsState, setTabsState] = useState<VotingTabs>(router.query.method as VotingTabs); // TODO: Change to routes
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
    setTokenPair({
      token1: TEZOS_TOKEN,
      token2: networksDefaultTokens[NETWORK_ID]
    });
  }, []);

  useEffect(() => {
    if (from && to && !initialLoad && tokens.length > 0 && exchangeRates) {
      handleSearchToken({
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
        showErrorToast,
        tezos,
        accountPkh,
        NETWORK_ID
      );
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh, tokenPair]);

  useEffect(() => {
    if (initialLoad && token1 && token2) {
      getBalance();
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh]);

  useOnBlock(tezos, getBalance);

  return (
    <Fragment>
      <VotingStats
        pendingReward={accountPkh ? rewards : null}
        balanceAmount={tokenPair.balance ?? null}
        voteAmount={voter?.vote ?? null}
        vetoAmount={voter?.veto ?? null}
        className={s.votingStats}
        dex={dex}
        handleSubmit={(params: TransferParams[]) => {
          if (!tezos) {
            return;
          }

          return submitWithdraw(tezos, params, showErrorToast, confirmOperation, getBalance);
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
              showErrorToast,
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
              debounce={100}
              save={noop}
              tabsState={tabsState}
              rewards={rewards}
              voter={voter}
              dex={dex}
              tokenPair={tokenPair}
              tokensData={tokensData}
              currentTab={currentTab}
              setRewards={setRewards}
              setDex={setDex}
              setTokens={setTokens}
              setTokenPair={setTokenPair}
              setVoter={setVoter}
              setTabsState={setTabsState}
              getBalance={getBalance}
              handleSubmit={handleSubmit}
              handleTokenChange={handleTokenChange}
            />
          )}
        />

        <VotingDetails tokenPair={tokenPair} dex={dex} voter={voter} />
      </StickyBlock>
    </Fragment>
  );
};
