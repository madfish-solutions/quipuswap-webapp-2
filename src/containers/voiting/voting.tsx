import { useEffect, useCallback, Fragment } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { FormApi, Mutator } from 'final-form';
import { useTranslation } from 'next-i18next';
import { withTypes } from 'react-final-form';

import { NETWORK, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { PageTitle } from '@components/common/page-title';
import { useToasts } from '@hooks/use-toasts';
import { useExchangeRates } from '@hooks/useExchangeRate';
import s from '@styles/CommonContainer.module.sass';
import { useTezos, useOnBlock, useAccountPkh, useSearchCustomTokens, useTokens } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { handleSearchToken, isNull, getTokensOptionalPairName, isEmptyArray, TokenNumber } from '@utils/helpers';
import { VoteFormValues, Nullable } from '@utils/types';

import { bakerCleaner, handleTokenPairSelect, submitForm } from './helpers';
import {
  useRewards,
  useTokensPair,
  useVoter,
  useVotingDex,
  useVotingHandlers,
  useVotingRouting,
  useVotingTokens
} from './helpers/voting.provider';
import { VotingDetails, VotingForm, VotingStats } from './structures';
import { VotingTabs } from './tabs.enum';

interface VotingProps {
  className?: string;
}

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
  const { token1, token2, setTokens } = useVotingTokens();
  const { dex, setDex } = useVotingDex();
  const { Form } = withTypes<VoteFormValues>();
  const { setRewards } = useRewards();
  const { setVoter } = useVoter();

  const { tokenPair, setTokenPair } = useTokensPair();

  const { setUrlLoaded, initialLoad, setInitialLoad, from, to, currentTab } = useVotingRouting();

  const { handleTokenChangeWrapper } = useVotingHandlers();

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
      handleTokenChangeWrapper(tokenPair.token1, TokenNumber.FIRST),
      handleTokenChangeWrapper(tokenPair.token2, TokenNumber.SECOND)
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
  }, [tokenPair, showErrorToast, tezos, accountPkh, setVoter, setRewards, setDex, setTokenPair]);

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
        dex={dex}
        setDex={setDex}
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
      <VotingStats className={s.votingStats} />

      <StickyBlock className={className}>
        <Form
          onSubmit={handleVote}
          mutators={mutators}
          render={({ handleSubmit, form }) => handleFormRender(handleSubmit as () => Promise<void>, form)}
        />
        <VotingDetails />
      </StickyBlock>
    </Fragment>
  );
};
