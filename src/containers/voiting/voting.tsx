import { useMemo, useState, useEffect, useCallback, Fragment } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { StickyBlock } from '@quipuswap/ui-kit';
import { FormApi, Mutator } from 'final-form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { withTypes } from 'react-final-form';

import { NETWORK, networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { PageTitle } from '@components/common/page-title';
import { useToasts } from '@hooks/use-toasts';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { useRouterPair } from '@hooks/useRouterPair';
import s from '@styles/CommonContainer.module.sass';
import { useTezos, useOnBlock, useAccountPkh, useSearchCustomTokens, useTokens } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import {
  handleSearchToken,
  handleTokenChange,
  fallbackTokenToTokenData,
  isNull,
  getTokensOptionalPairName,
  isEmptyArray
} from '@utils/helpers';
import { TokenDataMap, VoteFormValues, WhitelistedToken, WhitelistedTokenPair, Nullable } from '@utils/types';

import { bakerCleaner, handleTokenPairSelect, submitForm } from './helpers';
import { useRewards, useVoter } from './helpers/voting.provider';
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

export const VotingInner: React.FC<VotingProps> = ({ className }) => {
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
  const [dex, setDex] = useState<Nullable<FoundDex>>(null);
  const { Form } = withTypes<VoteFormValues>();
  const { setRewards } = useRewards();
  const { setVoter } = useVoter();

  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [tokenPair, setTokenPair] = useState<WhitelistedTokenPair>(fallbackTokenPair);
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
    await handleTokenChange({
      token,
      tokenNumber,
      // @ts-ignore
      exchangeRates,
      tezos: tezos!,
      accountPkh: accountPkh!,
      setTokensData
    });
  };

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
        searchCustomToken,
        handleTokenChangeWrapper
      });
    }
    // eslint-disable-next-line
  }, [from, to, initialLoad, tokens, exchangeRates]);

  const handleTokensChange = async () => {
    await Promise.all([
      handleTokenChangeWrapper(tokenPair.token1, 'first'),
      handleTokenChangeWrapper(tokenPair.token2, 'second')
    ]);
  };

  const getBalances = useCallback(async () => {
    await handleTokenPairSelect(
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
  }, [tokenPair, showErrorToast, tezos, accountPkh, setVoter, setRewards]);

  const getBalance = useCallback(
    () => {
      if (tezos && tokenPair.token1 && tokenPair.token2) {
        handleTokensChange();
        getBalances();
      }
    },
    // eslint-disable-next-line
    [tezos, accountPkh, tokenPair, showErrorToast]
  );

  useEffect(() => {
    if (initialLoad && token1 && token2) {
      void getBalances();
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh]);

  const reloadBalances = useCallback(() => {
    getBalances();
  }, [getBalances]);

  useOnBlock(tezos, reloadBalances);

  const balanceAmount = accountPkh && tokenPair.balance ? tokenPair.balance : null;

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
      getBalance();
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

  const handleFormRender = (handleSubmit: () => Promise<void>, form: FormApi<VoteFormValues>) => {
    if (pointerForm.form !== form) {
      pointerForm.form = form;
    }

    return (
      <VotingForm
        form={form}
        tabsState={tabsState}
        dex={dex}
        tokenPair={tokenPair}
        tokensData={tokensData}
        currentTab={currentTab}
        setDex={setDex}
        setTokens={setTokens}
        setTokenPair={setTokenPair}
        setTabsState={setTabsState}
        getBalance={getBalance}
        handleSubmit={handleSubmit}
        handleTokenChange={handleTokenChangeWrapper}
        bakerCleaner={bakerCleaner}
      />
    );
  };

  const title = `${t('common|Voting')} ${getTokensOptionalPairName(tokenPair.token1, tokenPair.token2)}`;

  return (
    <Fragment>
      <PageTitle>{title}</PageTitle>
      <VotingStats balanceAmount={balanceAmount} className={s.votingStats} dex={dex} />

      <StickyBlock className={className}>
        <Form
          onSubmit={handleVote}
          mutators={mutators}
          render={({ handleSubmit, form }) => handleFormRender(handleSubmit as () => Promise<void>, form)}
        />
        <VotingDetails tokenPair={tokenPair} dex={dex} />
      </StickyBlock>
    </Fragment>
  );
};
