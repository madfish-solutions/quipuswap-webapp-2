import { useCallback, useEffect, useMemo, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useNavigate, useParams } from 'react-router-dom';

import { useBalances } from '@providers/balances-provider';
import { useTokens } from '@providers/dapp-tokens';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import {
  amountsAreEqual,
  DexGraph,
  getTokenPairSlug,
  getTokenSlug,
  getTokensOptionalPairName,
  isEmptyArray,
  makeSwapOrSendRedirectionUrl,
  makeToken
} from '@shared/helpers';
import { getTokenIdFromSlug } from '@shared/helpers/tokens/get-token-id-from-slug';
import { useDexGraph, useOnBlock } from '@shared/hooks';
import { useInitialTokensSlugs } from '@shared/hooks/use-initial-tokens-slugs';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { SwapTabAction, Token, TokenMetadata, Undefined } from '@shared/types';
import { useTranslation } from '@translation';

import { useSwapCalculations } from './hooks/use-swap-calculations';
import { useSwapDetails } from './hooks/use-swap-details';
import { useSwapFormik } from './hooks/use-swap-formik';
import { useSwapLimits } from './providers/swap-limits-provider';
import { getBalanceByTokenSlug } from './utils/get-balance-by-token-slug';
import { SwapAmountFieldName, SwapField, SwapFormValues, SwapTokensFieldName } from './utils/types';

function tokensMetadataIsSame(token1: Token, token2: Token) {
  const propsToCompare: (keyof TokenMetadata)[] = ['decimals', 'name', 'symbol', 'thumbnailUri'];

  return propsToCompare.every(propName => token1.metadata[propName] === token2.metadata[propName]);
}

const PRICE_IMPACT_WARNING_THRESHOLD = 10;

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useSwapSendViewModel = (initialAction: Undefined<SwapTabAction>) => {
  const exchangeRates = useNewExchangeRates();

  const swap = useSwapCalculations();
  const { dexRoute } = swap;

  const {
    errors,
    values,
    isSubmitting,
    validateField,
    setValues,
    setFieldValue,
    setFieldTouched,
    submitForm,
    touched
  } = useSwapFormik(initialAction, dexRoute, exchangeRates);
  const formik = values;

  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation(['swap']);
  const fromToSlug = (params.fromTo as string) ?? '';
  const { maxInputAmounts, maxOutputAmounts, updateSwapLimits } = useSwapLimits();
  const {
    settings: { tradingSlippage }
  } = useSettingsStore();

  const getRedirectionUrl = useCallback(
    (from: string, to: string) => makeSwapOrSendRedirectionUrl({ from, to }, formik.action),
    [formik.action]
  );
  const [initialFrom, initialTo] = useInitialTokensSlugs(fromToSlug, getRedirectionUrl) ?? [];

  const TabsContent = [
    { id: SwapTabAction.SWAP, label: t('swap|Swap') },
    { id: SwapTabAction.SEND, label: t('swap|Send') }
  ];

  const prevCalculatedInputAmountRef = useRef(swap.inputAmount);
  const prevCalculatedOutputAmountRef = useRef(swap.outputAmount);

  useEffect(() => {
    if (!amountsAreEqual(swap.inputAmount, prevCalculatedInputAmountRef.current)) {
      setFieldValue(SwapField.INPUT_AMOUNT, swap.inputAmount).then(() => {
        validateField(SwapField.INPUT_AMOUNT);
        if (swap.inputAmount) {
          setFieldTouched(SwapField.INPUT_AMOUNT, true);
        }
      });
      prevCalculatedInputAmountRef.current = swap.inputAmount;
    }
    if (!amountsAreEqual(swap.outputAmount, prevCalculatedOutputAmountRef.current)) {
      setFieldValue(SwapField.OUTPUT_AMOUNT, swap.outputAmount);
      prevCalculatedOutputAmountRef.current = swap.outputAmount;
    }
  }, [swap, formik, setFieldValue, setFieldTouched, validateField]);

  const { swapFee, swapFeeError, priceImpact, buyRate, sellRate } = useSwapDetails({
    inputToken: formik.inputToken,
    outputToken: formik.outputToken,
    inputAmount: formik.inputAmount,
    outputAmount: formik.outputAmount,
    slippageTolerance: tradingSlippage,
    dexRoute: swap.dexRoute,
    recipient: formik.recipient
  });

  const onTokensSelected = useCallback(
    (_inputToken: Token, _outputToken: Token) => {
      updateSwapLimits(_inputToken, _outputToken);
      const newRoute = `/${formik.action}/${getTokenPairSlug(_inputToken, _outputToken)}`;

      navigate(newRoute);
    },
    [formik.action, navigate, updateSwapLimits]
  );

  const { balances, updateBalance } = useBalances();
  const tezos = useTezos();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const { label: currentTabLabel } = TabsContent.find(({ id }) => id === formik.action)!;

  const { dexGraph, dataIsStale, refreshDexPools, dexPoolsLoading } = useDexGraph();
  const prevDexGraphRef = useRef<DexGraph>();
  const prevInitialFromRef = useRef<string>();
  const prevInitialToRef = useRef<string>();
  const prevAccountPkh = useRef<string | null>(null);

  useEffect(() => void validateField(SwapField.INPUT_AMOUNT), [validateField, maxInputAmounts, balances]);
  useEffect(() => void validateField(SwapField.OUTPUT_AMOUNT), [validateField, maxOutputAmounts]);

  const updateSelectedTokensBalances = useCallback(() => {
    Promise.all(
      [formik.inputToken, formik.outputToken].map(async token => {
        if (token) {
          try {
            await updateBalance(token);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        }
      })
    );
  }, [formik.inputToken, formik.outputToken, updateBalance]);

  const refreshDexPoolsIfNecessary = () => {
    if (dataIsStale && !dexPoolsLoading) {
      refreshDexPools();
    }
  };

  useEffect(() => {
    if (prevAccountPkh.current !== accountPkh) {
      updateSelectedTokensBalances();
    }
    prevAccountPkh.current = accountPkh;
  }, [accountPkh, updateSelectedTokensBalances]);

  useEffect(() => {
    const prevInitialFrom = prevInitialFromRef.current;
    const prevInitialTo = prevInitialToRef.current;
    prevInitialFromRef.current = initialFrom;
    prevInitialToRef.current = initialTo;
    if ((initialFrom || initialTo) && (prevInitialFrom !== initialFrom || prevInitialTo !== initialTo)) {
      const valuesToChange: Partial<SwapFormValues> = {};
      if (initialFrom) {
        const newInputToken = makeToken(getTokenIdFromSlug(initialFrom), tokens);
        valuesToChange[SwapField.INPUT_TOKEN] = newInputToken;
        // eslint-disable-next-line no-console
        updateBalance(newInputToken).catch(console.error);
      }
      if (initialTo) {
        const newOutputToken = makeToken(getTokenIdFromSlug(initialTo), tokens);
        valuesToChange[SwapField.OUTPUT_TOKEN] = newOutputToken;
        // eslint-disable-next-line no-console
        updateBalance(newOutputToken).catch(console.error);
      }
      setValues(prevValues => ({ ...prevValues, ...valuesToChange }));
      swap.onSwapPairChange({
        inputToken: valuesToChange[SwapField.INPUT_TOKEN] ?? formik.inputToken,
        outputToken: valuesToChange[SwapField.OUTPUT_TOKEN] ?? formik.outputToken
      });
    }
  }, [initialFrom, initialTo, setValues, tokens, swap, formik.inputToken, formik.outputToken, updateBalance]);

  useEffect(() => {
    if (formik.inputToken && formik.outputToken) {
      const inputTokenSlug = getTokenSlug(formik.inputToken);
      const outputTokenSlug = getTokenSlug(formik.outputToken);
      const newInputToken = tokens.find(token => inputTokenSlug === getTokenSlug(token));
      const newOutputToken = tokens.find(token => outputTokenSlug === getTokenSlug(token));
      if (
        newInputToken &&
        newOutputToken &&
        (!tokensMetadataIsSame(formik.inputToken, newInputToken) ||
          !tokensMetadataIsSame(formik.outputToken, newOutputToken))
      ) {
        setValues(prevValues => ({
          ...prevValues,
          [SwapField.INPUT_TOKEN]: newInputToken,
          [SwapField.OUTPUT_TOKEN]: newOutputToken
        }));
        // eslint-disable-next-line no-console
        Promise.all([updateBalance(newInputToken), updateBalance(newOutputToken)]).catch(console.error);
        swap.onSwapPairChange({ inputToken: newInputToken, outputToken: newOutputToken });
      }
    }
  }, [setValues, formik.inputToken, formik.outputToken, tokens, swap, updateBalance]);

  useEffect(() => {
    if (prevDexGraphRef.current !== dexGraph && formik.inputToken && formik.outputToken) {
      updateSwapLimits(formik.inputToken, formik.outputToken);
    }
    prevDexGraphRef.current = dexGraph;
  }, [dexGraph, formik.inputToken, formik.outputToken, updateSwapLimits]);

  useOnBlock(tezos, updateSelectedTokensBalances);

  const resetTokensAmounts = useCallback(() => {
    setFieldTouched(SwapField.INPUT_AMOUNT, false);
    setFieldTouched(SwapField.OUTPUT_AMOUNT, false);
    setValues(prevValues => ({ ...prevValues, inputAmount: undefined, outputAmount: undefined }));
    swap.resetCalculations();
  }, [swap, setFieldTouched, setValues]);

  const handleSubmit = async () => {
    await submitForm();
    resetTokensAmounts();
  };

  const handleTabSwitch = useCallback(
    (newTabId: string) => {
      const valuesToSet: Partial<SwapFormValues> = {
        action: newTabId as SwapTabAction
      };
      if (newTabId === SwapTabAction.SWAP) {
        valuesToSet.recipient = undefined;
      }

      setValues(prevValues => ({ ...prevValues, ...valuesToSet }));
      navigate(
        makeSwapOrSendRedirectionUrl(
          {
            from: formik.inputToken && getTokenSlug(formik.inputToken),
            to: formik.outputToken && getTokenSlug(formik.outputToken)
          },
          valuesToSet.action
        )
      );
    },
    [setValues, navigate, formik.inputToken, formik.outputToken]
  );

  const blackListedTokens = useMemo(
    () => [formik.inputToken, formik.outputToken].filter((x): x is Token => !!x),
    [formik.inputToken, formik.outputToken]
  );

  const handleInputAmountChange = (newAmount: Undefined<BigNumber>) => {
    refreshDexPoolsIfNecessary();
    setFieldTouched(SwapField.INPUT_AMOUNT, true);
    setFieldValue(SwapField.INPUT_AMOUNT, newAmount, true);
    swap.onInputAmountChange(newAmount ?? null);
  };
  const handleOutputAmountChange = (newAmount: Undefined<BigNumber>) => {
    refreshDexPoolsIfNecessary();
    setFieldTouched(SwapField.OUTPUT_AMOUNT, true);
    setFieldValue(SwapField.OUTPUT_AMOUNT, newAmount, true);
    swap.onOutputAmountChange(newAmount ?? null);
  };

  const handleSomeTokenChange = (
    fieldName: SwapTokensFieldName,
    amountFieldName: SwapAmountFieldName,
    newToken?: Token
  ) => {
    refreshDexPoolsIfNecessary();
    setFieldTouched(fieldName, true);
    const valuesToSet: Partial<SwapFormValues> = {
      [fieldName]: newToken
    };
    const amount = amountFieldName === SwapField.INPUT_AMOUNT ? formik.inputAmount : formik.outputAmount;
    if (newToken && amount) {
      setFieldTouched(amountFieldName, true);
      valuesToSet[amountFieldName] = amount.decimalPlaces(newToken.metadata.decimals);
    }
    setValues(prevValues => ({ ...prevValues, ...valuesToSet }));
    if (newToken) {
      updateBalance(newToken);
    }
    const newInputToken = fieldName === SwapField.INPUT_TOKEN ? newToken : formik.inputToken;
    const newOutputToken = fieldName === SwapField.OUTPUT_TOKEN ? newToken : formik.outputToken;
    swap.onSwapPairChange({ inputToken: newInputToken, outputToken: newOutputToken });
    if (newInputToken && newOutputToken) {
      onTokensSelected(newInputToken, newOutputToken);
    }
  };

  const handleInputTokenChange = (newToken?: Token) => {
    handleSomeTokenChange(SwapField.INPUT_TOKEN, SwapField.INPUT_AMOUNT, newToken);
  };
  const handleOutputTokenChange = (newToken?: Token) =>
    handleSomeTokenChange(SwapField.OUTPUT_TOKEN, SwapField.OUTPUT_AMOUNT, newToken);

  const handleSwapButtonClick = () => {
    refreshDexPoolsIfNecessary();
    setValues(prevState => ({
      ...prevState,
      inputToken: formik.outputToken,
      outputToken: formik.inputToken,
      inputAmount: formik.outputAmount
    }));
    swap.onSwapPairChange({ inputToken: formik.outputToken, outputToken: formik.inputToken });
    swap.onInputAmountChange(formik.outputAmount ?? null);
    if (formik.inputToken && formik.outputToken) {
      onTokensSelected(formik.outputToken, formik.inputToken);
    }
  };

  const handleRecipientChange = useCallback(
    (newValue: string) => {
      setFieldTouched(SwapField.RECIPIENT, true);
      setFieldValue(SwapField.RECIPIENT, newValue, true);
    },
    [setFieldValue, setFieldTouched]
  );

  const handleRecipientChangeFromEvent = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => handleRecipientChange(e.currentTarget.value),
    [handleRecipientChange]
  );

  const inputTokenSlug = formik.inputToken && getTokenSlug(formik.inputToken);
  const outputTokenSlug = formik.outputToken && getTokenSlug(formik.outputToken);
  const inputTokenBalance = getBalanceByTokenSlug(inputTokenSlug, balances);
  const outputTokenBalance = getBalanceByTokenSlug(outputTokenSlug, balances);

  const touchedFieldsErrors = Object.entries(touched).reduce<Partial<Record<keyof SwapFormValues, string>>>(
    (errorsPart, [key, isTouched]) => ({
      ...errorsPart,
      [key]: isTouched ? errors[key as keyof SwapFormValues] : undefined
    }),
    {}
  );

  const swapInputError = touchedFieldsErrors[SwapField.INPUT_TOKEN] ?? touchedFieldsErrors[SwapField.INPUT_AMOUNT];
  const swapOutputError = touchedFieldsErrors[SwapField.OUTPUT_TOKEN] ?? touchedFieldsErrors[SwapField.OUTPUT_AMOUNT];
  const inputExchangeRate = inputTokenSlug === undefined ? undefined : exchangeRates[inputTokenSlug];
  const outputExchangeRate = outputTokenSlug === undefined ? undefined : exchangeRates[outputTokenSlug];
  const submitDisabled = !isEmptyArray(Object.keys(errors));

  const title = `${t('swap|Swap')} ${getTokensOptionalPairName(formik.inputToken, formik.outputToken)}`;
  const noRouteFound =
    !swap.dexRoute && formik.inputToken && formik.outputToken && (formik.inputAmount || formik.outputAmount);
  const shouldShowPriceImpactWarning = priceImpact?.gt(PRICE_IMPACT_WARNING_THRESHOLD);

  return {
    accountPkh,
    action: formik.action,
    blackListedTokens,
    buyRate,
    currentTabLabel,
    dataIsStale,
    dexPoolsLoading,
    dexRoute: swap.dexRoute,
    handleInputAmountChange,
    handleInputTokenChange,
    handleOutputAmountChange,
    handleOutputTokenChange,
    handleRecipientChange,
    handleRecipientChangeFromEvent,
    handleSubmit,
    handleSwapButtonClick,
    handleTabSwitch,
    inputAmount: formik.inputAmount,
    inputExchangeRate,
    inputToken: formik.inputToken,
    inputTokenBalance,
    isSubmitting,
    noRouteFound,
    outputAmount: formik.outputAmount,
    outputExchangeRate,
    outputToken: formik.outputToken,
    outputTokenBalance,
    PRICE_IMPACT_WARNING_THRESHOLD,
    priceImpact,
    recipient: formik.recipient,
    refreshDexPools,
    sellRate,
    shouldShowPriceImpactWarning,
    submitDisabled,
    swapFee,
    swapFeeError,
    swapInputError,
    swapOutputError,
    t,
    TabsContent,
    title,
    touchedFieldsErrors
  };
};
