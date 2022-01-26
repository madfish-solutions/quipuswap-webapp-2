import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { FoundDex, TransferParams } from '@quipuswap/sdk';
import { StickyBlock } from '@quipuswap/ui-kit';
import { FormApi, Mutator } from 'final-form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { withTypes } from 'react-final-form';

import { NETWORK_ID, networksDefaultTokens, TEZOS_TOKEN } from '@app.config';
import { PageTitle } from '@components/common/page-title';
import { getRewards } from '@containers/voiting/helpers/get-rewards';
import { getShareBalances } from '@containers/voiting/helpers/get-shares-balances';
import { getVoter } from '@containers/voiting/helpers/get-voter';
import { useToasts } from '@hooks/use-toasts';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { useRouterPair } from '@hooks/useRouterPair';
import s from '@styles/CommonContainer.module.sass';
import { useAccountPkh, useOnBlock, useSearchCustomTokens, useTezos, useTokens } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { getDex } from '@utils/dapp/get-dex';
import { fallbackTokenToTokenData, isEmptyArray, isNull } from '@utils/helpers';
import {
  Nullable,
  TokenDataMap,
  VoteFormValues,
  VoterType,
  WhitelistedToken,
  WhitelistedTokenPair
} from '@utils/types';

import { bakerCleaner, handleSearchToken, handleTokenChange, submitForm, submitWithdraw } from './helpers';
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

const DEFAULT_REWARDS = '0';

// TODO: Refactor solution of BakerCleaner

interface pForm {
  form: Nullable<FormApi<VoteFormValues, Partial<VoteFormValues>>>;
}

const pointerForm: pForm = { form: null };
const BALANCE1 = 'balance1';
const SELECTED_BAKER = 'selectedBaker';

const cleanUp = (tab: VotingTabs) => {
  if (!isNull(pointerForm.form)) {
    pointerForm.form.mutators.setValue(BALANCE1, null);
    if (tab === VotingTabs.vote) {
      pointerForm.form.mutators.setValue(SELECTED_BAKER, null);
      bakerCleaner.run();
    }
  }
};

export const Voting: FC<VotingProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
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
  const [initialLoad, setInitialLoad] = useState(false);
  const [dex, setDex] = useState<Nullable<FoundDex>>(null);
  const { Form } = withTypes<VoteFormValues>();
  const [urlLoaded, setUrlLoaded] = useState(true);
  const [rewards, setRewards] = useState(DEFAULT_REWARDS);
  const [voter, setVoter] = useState<Nullable<VoterType>>(null);
  const [tokenPair, setTokenPair] = useState<WhitelistedTokenPair>(fallbackTokenPair);
  const [isTokenLoading, setTokenLoading] = useState(true);

  const router = useRouter();
  const [tabsState, setTabsState] = useState<VotingTabs>(router.query.method as VotingTabs);
  const { from, to } = useRouterPair({
    page: `voting/${router.query.method}`,
    urlLoaded,
    initialLoad,
    token1: tokenPair.token1,
    token2: tokenPair.token2
  });

  const currentTab = useMemo(() => TabsContent.find(({ id }) => id === tabsState)!, [tabsState]);

  const handleTokenChangeWrapper = async (token: WhitelistedToken, tokenNumber: 'first' | 'second') => {
    let isMounted = true;
    if (!exchangeRates) {
      return;
    }
    setTokenLoading(true);
    const data = await handleTokenChange({
      token,
      exchangeRates,
      tezos,
      accountPkh
    });
    if (data) {
      setTokensData(prevState => ({
        ...prevState,
        [tokenNumber]: data
      }));
    }

    if (isMounted) {
      setTokenLoading(false);
    }

    return () => (isMounted = false);
  };

  const loadPair = useCallback(async () => {
    const secondAsset = {
      contract: tokenPair.token2.contractAddress,
      id: tokenPair.token2.fa2TokenId
    };

    const foundDex = await getDex(tezos, secondAsset);
    setDex(foundDex);

    if (!foundDex || !accountPkh) {
      setTokenPair({
        ...tokenPair,
        frozenBalance: undefined,
        balance: undefined,
        dex: undefined
      });
    }

    const rewards = await getRewards(tezos, foundDex, accountPkh);
    setRewards(rewards || DEFAULT_REWARDS);

    const voter = await getVoter(accountPkh, foundDex);
    setVoter(voter);

    const shareBalances = await getShareBalances(tezos, foundDex, accountPkh);
    if (shareBalances) {
      const { frozenBalance, totalBalance } = shareBalances;
      setTokenPair({
        ...tokenPair,
        frozenBalance,
        balance: totalBalance
      });
    }
  }, [accountPkh, tezos, tokenPair]);

  useEffect(() => {
    if (from && to && !initialLoad && !isEmptyArray(tokens) && exchangeRates) {
      void handleSearchToken({
        tokens,
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

  const updateTokens = useCallback(() => {
    const load = async () => {
      try {
        await handleTokenChangeWrapper(tokenPair.token1, 'first');
        await handleTokenChangeWrapper(tokenPair.token2, 'second');

        await loadPair();
      } catch (error) {
        showErrorToast(error as Error);
      }
    };

    if (tezos && tokenPair.token1 && tokenPair.token2) {
      void load();
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh, tokenPair, loadPair]);

  // TODO: Implement it
  const updateTokensBalances = useCallback(async () => {
    const load = async () => {
      if (!exchangeRates || !tokenPair.token1) {
        return;
      }
      const data = await Promise.all([
        await handleTokenChange({
          token: tokenPair.token1,
          exchangeRates,
          tezos,
          accountPkh
        }),
        await handleTokenChange({
          token: tokenPair.token2,
          exchangeRates,
          tezos,
          accountPkh
        })
      ]);
      // eslint-disable-next-line no-console
      console.log('data', data);
    };

    if (tezos && tokenPair.token1 && tokenPair.token2) {
      await load();
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh, tokenPair]);

  useEffect(() => {
    if (initialLoad && token1 && token2) {
      void updateTokens();
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh]);

  useOnBlock(updateTokensBalances);

  const balanceAmount = accountPkh && tokenPair.balance ? tokenPair.balance : null;

  const handleClaimReward = async (params: TransferParams[]) => {
    if (!tezos) {
      return;
    }

    try {
      await submitWithdraw(tezos, params, confirmOperation);
      updateTokens();
    } catch (e) {
      showErrorToast(e as Error);
    }
  };

  const handleVote = async (values: VoteFormValues) => {
    if (!tezos) {
      return;
    }

    try {
      await submitForm({
        tezos,
        values,
        dex,
        tab: currentTab.id,
        confirmOperation
      });
      updateTokens();
      cleanUp(currentTab.id);
    } catch (e) {
      showErrorToast(e as Error);
    }
  };

  const mutators: { [key: string]: Mutator<VoteFormValues, Partial<VoteFormValues>> } = {
    setValue: ([field, value], state, { changeValue }) => {
      changeValue(state, field, () => value);
    }
  };

  const handleChangeTokenPair = (pair: WhitelistedTokenPair) => {
    setTokens([pair.token1, pair.token2]);
    void updateTokens();
  };

  const handleUnvoteOrRemoveVeto = () => {
    void updateTokens();
  };

  const handleFormRender = (handleSubmit: () => Promise<void>, form: FormApi<VoteFormValues>) => {
    if (pointerForm.form !== form) {
      pointerForm.form = form;
    }

    return (
      <VotingForm
        form={form}
        tabsState={tabsState}
        rewards={rewards}
        voter={voter!}
        dex={dex}
        tokenPair={tokenPair}
        tokensData={tokensData}
        currentTab={currentTab}
        tokensUpdading={isTokenLoading}
        setDex={setDex}
        onChangeTokenPair={handleChangeTokenPair}
        onUnvoteOrRemoveVeto={handleUnvoteOrRemoveVeto}
        setTabsState={setTabsState}
        updateTokens={updateTokens}
        handleSubmit={handleSubmit}
        bakerCleaner={bakerCleaner}
      />
    );
  };

  return (
    <Fragment>
      <PageTitle>{t('common|Voting')}</PageTitle>
      <VotingStats
        pendingReward={accountPkh ? rewards : null}
        balanceAmount={balanceAmount}
        voteAmount={voter?.vote ?? null}
        vetoAmount={voter?.veto ?? null}
        className={s.votingStats}
        dex={dex}
        onClaimReward={handleClaimReward}
      />

      <StickyBlock className={className}>
        <Form
          onSubmit={handleVote}
          mutators={mutators}
          render={({ handleSubmit, form }) => handleFormRender(handleSubmit as () => Promise<void>, form)}
        />
        <VotingDetails tokenPair={tokenPair} dex={dex} voter={voter} />
      </StickyBlock>
    </Fragment>
  );
};
