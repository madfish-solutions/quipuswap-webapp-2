import { useEffect, useCallback, FC } from 'react';

import { FormApi, Mutator } from 'final-form';
import { withTypes } from 'react-final-form';

import { NETWORK, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { useToasts } from '@hooks/use-toasts';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { useTezos, useOnBlock, useAccountPkh, useSearchCustomTokens, useTokens } from '@utils/dapp';
import { handleSearchToken, isNull, isEmptyArray, TokenNumber } from '@utils/helpers';
import { VoteFormValues, Nullable } from '@utils/types';

import { bakerCleaner, handleTokenPairSelect } from '../../helpers';
import {
  useRewards,
  useTokensPair,
  useVoter,
  useVotingDex,
  useVotingHandlers,
  useVotingRouting,
  useVotingTokens
} from '../../helpers/voting.provider';
import { useHandleVote } from '../../hooks';
import { VotingTabs } from '../../tabs.enum';
import { VotingForm } from './voting-form';

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

export const WrappedVotingForm: FC = () => {
  const { showErrorToast } = useToasts();
  const tezos = useTezos();
  const exchangeRates = useExchangeRates();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const searchCustomToken = useSearchCustomTokens();
  const { token1, token2, setTokens } = useVotingTokens();
  const { setDex } = useVotingDex();
  const { Form } = withTypes<VoteFormValues>();
  const { setRewards } = useRewards();
  const { setVoter } = useVoter();

  const { tokenPair, setTokenPair } = useTokensPair();

  const { setUrlLoaded, initialLoad, setInitialLoad, from, to } = useVotingRouting();

  const { handleTokenChange } = useVotingHandlers();

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
        handleTokenChange
      });
    }
    // eslint-disable-next-line
  }, [from, to, initialLoad, tokens, exchangeRates]);

  const handleTokensChange = async () => {
    await Promise.all([
      handleTokenChange(tokenPair.token1, TokenNumber.FIRST),
      handleTokenChange(tokenPair.token2, TokenNumber.SECOND)
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

  const handleVote = useHandleVote(getBalance, cleanUp);

  const mutators: { [key: string]: Mutator<VoteFormValues, Partial<VoteFormValues>> } = {
    setValue: ([field, value], state, { changeValue }) => {
      changeValue(state, field, () => value);
    }
  };

  const handleFormRender = (handleSubmit: () => Promise<void>, form: FormApi<VoteFormValues>) => {
    if (pointerForm.form !== form) {
      pointerForm.form = form;
    }

    return <VotingForm form={form} getBalance={getBalance} handleSubmit={handleSubmit} bakerCleaner={bakerCleaner} />;
  };

  return (
    <Form
      onSubmit={handleVote}
      mutators={mutators}
      render={({ handleSubmit, form }) => handleFormRender(handleSubmit as () => Promise<void>, form)}
    />
  );
};
