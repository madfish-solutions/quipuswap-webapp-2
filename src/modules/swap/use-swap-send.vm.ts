import { useCallback, useEffect, useMemo, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useNavigate, useParams } from 'react-router-dom';
import { DexTypeEnum } from 'swap-router-sdk';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';

import { useBalances } from '@providers/balances-provider';
import { useTokens } from '@providers/dapp-tokens';
import { useAccountPkh } from '@providers/use-dapp';
import { useNewExchangeRates } from '@providers/use-exchange-rate';
import {
  amountsAreEqual,
  getSymbolsString,
  getTokenPairSlug,
  getTokenSlug,
  isEmptyArray,
  makeSwapOrSendRedirectionUrl,
  makeToken
} from '@shared/helpers';
import { getTokenIdFromSlug } from '@shared/helpers/tokens/get-token-id-from-slug';
import { useDexGraph, useOnBlock } from '@shared/hooks';
import { useAmplitudeService } from '@shared/hooks/use-amplitude-service';
import { useInitialTokensSlugs } from '@shared/hooks/use-initial-tokens-slugs';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { SwapTabAction, Token, Undefined } from '@shared/types';
import { useTranslation } from '@translation';

import { useSwapCalculations } from './hooks/use-swap-calculations';
import { useRealSwapDetails } from './hooks/use-swap-details';
import { useSwapFormik } from './hooks/use-swap-formik';
import { useRoutePairs } from './providers/route-pairs-provider';
import { useSwapLimits } from './providers/swap-limits-provider';
import { getBalanceByTokenSlug } from './utils/get-balance-by-token-slug';
import { SwapAmountFieldName, SwapField, SwapFormValues, SwapTokensFieldName } from './utils/types';

const metadataPropsToCompare = ['decimals', 'name', 'symbol', 'thumbnailUri'] as const;

function tokensMetadataIsSame(token1: Token, token2: Token) {
  return metadataPropsToCompare.every(propName => token1.metadata[propName] === token2.metadata[propName]);
}

const PRICE_IMPACT_WARNING_THRESHOLD = 10;

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useSwapSendViewModel = (initialAction: Undefined<SwapTabAction>) => {
  const exchangeRates = useNewExchangeRates();

  const amplitude = useAmplitudeService();

  const {
    dexRoute,
    inputAmount,
    onInputAmountChange,
    onOutputAmountChange,
    onSwapPairChange,
    outputAmount,
    resetCalculations,
    trade,
    updateCalculations
  } = useSwapCalculations();

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
  } = useSwapFormik(initialAction, dexRoute, trade, exchangeRates);
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

  const prevCalculatedInputAmountRef = useRef(inputAmount);
  const prevCalculatedOutputAmountRef = useRef(outputAmount);

  useEffect(() => {
    if (!amountsAreEqual(inputAmount, prevCalculatedInputAmountRef.current)) {
      setFieldValue(SwapField.INPUT_AMOUNT, inputAmount);
      prevCalculatedInputAmountRef.current = inputAmount;
    }
    if (!amountsAreEqual(outputAmount, prevCalculatedOutputAmountRef.current)) {
      setFieldValue(SwapField.OUTPUT_AMOUNT, outputAmount);
      prevCalculatedOutputAmountRef.current = outputAmount;
    }
  }, [inputAmount, outputAmount, formik, setFieldValue]);

  useEffect(() => {
    validateField(SwapField.INPUT_AMOUNT).then(() => {
      if (formik.inputAmount) {
        setFieldTouched(SwapField.INPUT_AMOUNT, true);
      }
    });
  }, [formik.inputAmount, validateField, setFieldTouched]);
  useEffect(() => {
    validateField(SwapField.OUTPUT_AMOUNT).then(() => {
      if (formik.outputAmount) {
        setFieldTouched(SwapField.OUTPUT_AMOUNT, true);
      }
    });
  }, [formik.outputAmount, validateField, setFieldTouched]);

  const { swapFee, swapFeeError, priceImpact, buyRate, sellRate } = useRealSwapDetails({
    inputToken: formik.inputToken,
    outputToken: formik.outputToken,
    inputAmount: formik.inputAmount,
    outputAmount: formik.outputAmount,
    slippageTolerance: tradingSlippage,
    dexRoute,
    trade,
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
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const { label: currentTabLabel } = TabsContent.find(({ id }) => id === formik.action)!;

  // TODO: remove useDexGraph and related functions globally
  const { dataIsStale, refreshDexPools, dexPoolsLoading } = useDexGraph();
  const { routePairs, updateRoutePairs } = useRoutePairs();
  const prevRoutePairsRef = useRef<RoutePair[]>(routePairs);
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
      updateRoutePairs();
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
      onSwapPairChange({
        inputToken: valuesToChange[SwapField.INPUT_TOKEN] ?? formik.inputToken,
        outputToken: valuesToChange[SwapField.OUTPUT_TOKEN] ?? formik.outputToken
      });
    }
  }, [
    initialFrom,
    initialTo,
    setValues,
    tokens,
    onSwapPairChange,
    formik.inputToken,
    formik.outputToken,
    updateBalance
  ]);

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
        onSwapPairChange({ inputToken: newInputToken, outputToken: newOutputToken });
      }
    }
  }, [setValues, formik.inputToken, formik.outputToken, tokens, onSwapPairChange, updateBalance]);

  useEffect(() => {
    if (prevRoutePairsRef.current !== routePairs && formik.inputToken && formik.outputToken) {
      updateSwapLimits(formik.inputToken, formik.outputToken);
      updateCalculations();
    }
    prevRoutePairsRef.current = routePairs;
  }, [routePairs, formik.inputToken, formik.outputToken, updateSwapLimits, updateCalculations]);

  useOnBlock(updateSelectedTokensBalances);

  const resetTokensAmounts = useCallback(() => {
    setFieldTouched(SwapField.INPUT_AMOUNT, false);
    setFieldTouched(SwapField.OUTPUT_AMOUNT, false);
    setValues(prevValues => ({ ...prevValues, inputAmount: undefined, outputAmount: undefined }));
    resetCalculations();
  }, [resetCalculations, setFieldTouched, setValues]);

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
    onInputAmountChange(newAmount ?? null);
    amplitude.debounceLog('SWAP_INPUT_CHANGE', { amount: newAmount?.toFixed() });
  };

  const handleOutputAmountChange = (newAmount: Undefined<BigNumber>) => {
    refreshDexPoolsIfNecessary();
    setFieldTouched(SwapField.OUTPUT_AMOUNT, true);
    setFieldValue(SwapField.OUTPUT_AMOUNT, newAmount, true);
    onOutputAmountChange(newAmount ?? null);
    amplitude.debounceLog('SWAP_OUTPUT_CHANGE', { amount: newAmount?.toFixed() });
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
    onSwapPairChange({ inputToken: newInputToken, outputToken: newOutputToken });
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
    onSwapPairChange({ inputToken: formik.outputToken, outputToken: formik.inputToken });
    onInputAmountChange(formik.outputAmount ?? null);
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
      [key]: isTouched ? errors[key] : undefined
    }),
    {}
  );

  const swapInputError = touchedFieldsErrors[SwapField.INPUT_TOKEN] ?? touchedFieldsErrors[SwapField.INPUT_AMOUNT];
  const swapOutputError = touchedFieldsErrors[SwapField.OUTPUT_TOKEN] ?? touchedFieldsErrors[SwapField.OUTPUT_AMOUNT];
  const inputExchangeRate = inputTokenSlug === undefined ? undefined : exchangeRates[inputTokenSlug];
  const outputExchangeRate = outputTokenSlug === undefined ? undefined : exchangeRates[outputTokenSlug];
  const submitDisabled = !isEmptyArray(Object.keys(errors));

  const pairName =
    formik.inputToken && formik.outputToken ? getSymbolsString([formik.inputToken, formik.outputToken]) : '';
  const title = `${t('swap|Swap')} ${pairName}`;
  const noRouteFound =
    isEmptyArray(trade) && formik.inputToken && formik.outputToken && (formik.inputAmount || formik.outputAmount);
  const shouldShowPriceImpactWarning = priceImpact?.gt(PRICE_IMPACT_WARNING_THRESHOLD);
  const shouldHideRouteRow = trade?.some(({ dexType }) => dexType === DexTypeEnum.QuipuSwapCurveLike) ?? false;

  const updateRates = () => {
    refreshDexPools();
    updateRoutePairs();
  };

  return {
    accountPkh,
    action: formik.action,
    blackListedTokens,
    buyRate,
    currentTabLabel,
    dataIsStale,
    dexPoolsLoading,
    dexRoute,
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
    updateRates,
    sellRate,
    shouldHideRouteRow,
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
