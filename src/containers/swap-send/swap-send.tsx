import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import { Tabs, Card, Button, StickyBlock, SwapButton } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

import { ComplexRecipient } from '@components/ui/ComplexInput';
import { NewTokenSelect } from '@components/ui/ComplexInput/new-token-select';
import { useDexGraph } from '@hooks/use-dex-graph';
import { useInitialTokensSlugs } from '@hooks/use-initial-tokens-slugs';
import { useNewExchangeRates } from '@hooks/useNewExchangeRate';
import { useBalances } from '@providers/BalancesProvider';
import s from '@styles/CommonContainer.module.sass';
import { useAccountPkh, useNetwork, useOnBlock, useTezos, useTokens } from '@utils/dapp';
import { amountsAreEqual, getTokenIdFromSlug, getTokenSlug, isEmptyArray, makeWhitelistedToken } from '@utils/helpers';
import { DexGraph } from '@utils/routing';
import { Undefined, WhitelistedToken, WhitelistedTokenMetadata } from '@utils/types';

import { DeadlineInput } from './components/deadline-input';
import { SlippageInput } from './components/slippage-input';
import { SwapDetails } from './components/swap-details';
import { useSwapCalculations } from './hooks/use-swap-calculations';
import { useSwapDetails } from './hooks/use-swap-details';
import { useSwapFormik } from './hooks/use-swap-formik';
import { SwapLimitsProvider, useSwapLimits } from './providers/swap-limits-provider';
import { getBalanceByTokenSlug } from './utils/get-balance-by-token-slug';
import { SwapAmountFieldName, SwapField, SwapFormValues, SwapTokensFieldName } from './utils/types';

interface SwapSendProps {
  className?: string;
  fromToSlug?: string;
}

const getRedirectionUrl = (fromToSlug: string) => `/swap/${fromToSlug}`;

const TabsContent = [
  {
    id: 'swap',
    label: 'Swap'
  },
  {
    id: 'send',
    label: 'Send'
  }
];

function tokensMetadataIsSame(token1: WhitelistedToken, token2: WhitelistedToken) {
  const propsToCompare: (keyof WhitelistedTokenMetadata)[] = ['decimals', 'name', 'symbol', 'thumbnailUri'];

  return propsToCompare.every(propName => token1.metadata[propName] === token2.metadata[propName]);
}

const OrdinarySwapSend: FC<SwapSendProps> = ({ className, fromToSlug }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    errors,
    values: { deadline, inputToken, outputToken, inputAmount, outputAmount, action, recipient, slippage },
    validateField,
    setValues,
    setFieldValue,
    setFieldTouched,
    submitForm,
    touched
  } = useSwapFormik();
  const { maxInputAmounts, maxOutputAmounts, updateSwapLimits } = useSwapLimits();
  const initialTokens = useInitialTokensSlugs(fromToSlug, getRedirectionUrl);
  const initialFrom = initialTokens?.[0];
  const initialTo = initialTokens?.[1];

  const {
    dexRoute,
    onInputAmountChange,
    onOutputAmountChange,
    onSwapPairChange,
    inputAmount: calculatedInputAmount,
    outputAmount: calculatedOutputAmount,
    resetCalculations
  } = useSwapCalculations();
  const prevCalculatedInputAmountRef = useRef(calculatedInputAmount);
  const prevCalculatedOutputAmountRef = useRef(calculatedOutputAmount);

  useEffect(() => {
    if (!amountsAreEqual(calculatedInputAmount, prevCalculatedInputAmountRef.current)) {
      setFieldValue(SwapField.INPUT_AMOUNT, calculatedInputAmount).then(() => {
        setFieldTouched(SwapField.INPUT_AMOUNT, true);
      });
      prevCalculatedInputAmountRef.current = calculatedInputAmount;
    }
    if (!amountsAreEqual(calculatedOutputAmount, prevCalculatedOutputAmountRef.current)) {
      setFieldValue(SwapField.OUTPUT_AMOUNT, calculatedOutputAmount);
      prevCalculatedOutputAmountRef.current = calculatedOutputAmount;
    }
  }, [calculatedInputAmount, calculatedOutputAmount, inputAmount, outputAmount, setFieldValue, setFieldTouched]);

  const { swapFee, priceImpact, buyRate, sellRate } = useSwapDetails({
    inputToken,
    outputToken,
    inputAmount,
    outputAmount,
    slippageTolerance: slippage,
    dexRoute,
    recipient
  });

  const onTokensSelected = useCallback(
    (inputToken: WhitelistedToken, outputToken: WhitelistedToken) => {
      updateSwapLimits(inputToken, outputToken);
      const newRoute = `/swap/${getTokenSlug(inputToken)}-${getTokenSlug(outputToken)}`;
      if (location.pathname !== newRoute) {
        navigate(newRoute, { replace: true });
      }
    },
    [navigate, updateSwapLimits, location]
  );

  const { balances, updateBalance } = useBalances();
  const exchangeRates = useNewExchangeRates();
  const tezos = useTezos();
  const { data: tokens } = useTokens();
  const network = useNetwork();
  const accountPkh = useAccountPkh();
  const { label: currentTabLabel } = TabsContent.find(({ id }) => id === action)!;

  const { dexGraph } = useDexGraph();
  const prevDexGraphRef = useRef<DexGraph>();
  const prevInitialFromRef = useRef<string>();
  const prevInitialToRef = useRef<string>();
  const prevAccountPkh = useRef<string | null>(null);
  const prevNetworkRef = useRef(network);

  useEffect(() => void validateField(SwapField.INPUT_AMOUNT), [validateField, maxInputAmounts, balances]);
  useEffect(() => void validateField(SwapField.OUTPUT_AMOUNT), [validateField, maxOutputAmounts]);

  const updateSelectedTokensBalances = useCallback(() => {
    Promise.all(
      [inputToken, outputToken].map(async token => {
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
  }, [inputToken, outputToken, updateBalance]);

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
        const newInputToken = makeWhitelistedToken(getTokenIdFromSlug(initialFrom), tokens);
        valuesToChange[SwapField.INPUT_TOKEN] = newInputToken;
        // eslint-disable-next-line no-console
        updateBalance(newInputToken).catch(console.error);
      }
      if (initialTo) {
        const newOutputToken = makeWhitelistedToken(getTokenIdFromSlug(initialTo), tokens);
        valuesToChange[SwapField.OUTPUT_TOKEN] = newOutputToken;
        // eslint-disable-next-line no-console
        updateBalance(newOutputToken).catch(console.error);
      }
      setValues(prevValues => ({ ...prevValues, ...valuesToChange }));
      onSwapPairChange({
        inputToken: valuesToChange[SwapField.INPUT_TOKEN] ?? inputToken,
        outputToken: valuesToChange[SwapField.OUTPUT_TOKEN] ?? outputToken
      });
    }
  }, [initialFrom, initialTo, setValues, tokens, onSwapPairChange, inputToken, outputToken, updateBalance]);

  useEffect(() => {
    if (inputToken && outputToken) {
      const inputTokenSlug = getTokenSlug(inputToken);
      const outputTokenSlug = getTokenSlug(outputToken);
      const newInputToken = tokens.find(token => inputTokenSlug === getTokenSlug(token));
      const newOutputToken = tokens.find(token => outputTokenSlug === getTokenSlug(token));
      if (
        newInputToken &&
        newOutputToken &&
        (!tokensMetadataIsSame(inputToken, newInputToken) || !tokensMetadataIsSame(outputToken, newOutputToken))
      ) {
        setValues(prevValues => ({
          ...prevValues,
          token1: newInputToken,
          outputToken: newOutputToken
        }));
        // eslint-disable-next-line no-console
        Promise.all([updateBalance(newInputToken), updateBalance(newOutputToken)]).catch(console.error);
        onSwapPairChange({ inputToken: newInputToken, outputToken: newOutputToken });
      }
    }
  }, [setValues, inputToken, outputToken, tokens, onSwapPairChange, updateBalance]);

  useEffect(() => {
    if (prevDexGraphRef.current !== dexGraph && inputToken && outputToken) {
      updateSwapLimits(inputToken, outputToken);
    }
    prevDexGraphRef.current = dexGraph;
  }, [dexGraph, inputToken, outputToken, updateSwapLimits]);

  useOnBlock(tezos, updateSelectedTokensBalances);

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

  useEffect(() => {
    if (network.id !== prevNetworkRef.current.id) {
      resetTokensAmounts();
    }
    prevNetworkRef.current = network;
  }, [network, resetTokensAmounts]);

  const handleTabSwitch = useCallback(
    (newTabId: string) => {
      const valuesToSet: Partial<SwapFormValues> = {
        action: newTabId as SwapFormValues[SwapField.ACTION]
      };
      if (newTabId === 'swap') {
        valuesToSet.recipient = undefined;
      }

      setValues(prevValues => ({ ...prevValues, ...valuesToSet }));
    },
    [setValues]
  );

  const blackListedTokens = useMemo(
    () => [inputToken, outputToken].filter((x): x is WhitelistedToken => !!x),
    [inputToken, outputToken]
  );

  const handleInputAmountChange = (newAmount: Undefined<BigNumber>) => {
    setFieldTouched(SwapField.INPUT_AMOUNT, true);
    setFieldValue(SwapField.INPUT_AMOUNT, newAmount, true);
    onInputAmountChange(newAmount);
  };
  const handleOutputAmountChange = (newAmount: Undefined<BigNumber>) => {
    setFieldTouched(SwapField.OUTPUT_AMOUNT, true);
    setFieldValue(SwapField.OUTPUT_AMOUNT, newAmount, true);
    onOutputAmountChange(newAmount);
  };

  const handleSomeTokenChange = useCallback(
    (fieldName: SwapTokensFieldName, amountFieldName: SwapAmountFieldName, newToken?: WhitelistedToken) => {
      setFieldTouched(fieldName, true);
      const valuesToSet: Partial<SwapFormValues> = {
        [fieldName]: newToken
      };
      const amount = amountFieldName === SwapField.INPUT_AMOUNT ? inputAmount : outputAmount;
      if (newToken && amount) {
        setFieldTouched(amountFieldName, true);
        valuesToSet[amountFieldName] = amount.decimalPlaces(newToken.metadata.decimals);
      }
      setValues(prevValues => ({ ...prevValues, ...valuesToSet }));
      if (newToken) {
        updateBalance(newToken);
      }
      const newInputToken = fieldName === SwapField.INPUT_TOKEN ? newToken : inputToken;
      const newOutputToken = fieldName === SwapField.OUTPUT_TOKEN ? newToken : outputToken;
      onSwapPairChange({ inputToken: newInputToken, outputToken: newOutputToken });
      if (newInputToken && newOutputToken) {
        onTokensSelected(newInputToken, newOutputToken);
      }
    },
    [
      setValues,
      updateBalance,
      setFieldTouched,
      inputAmount,
      outputAmount,
      inputToken,
      outputToken,
      onTokensSelected,
      onSwapPairChange
    ]
  );

  const handleInputTokenChange = useCallback(
    (newToken?: WhitelistedToken) => {
      handleSomeTokenChange(SwapField.INPUT_TOKEN, SwapField.INPUT_AMOUNT, newToken);
    },
    [handleSomeTokenChange]
  );
  const handleOutputTokenChange = useCallback(
    (newToken?: WhitelistedToken) => handleSomeTokenChange(SwapField.OUTPUT_TOKEN, SwapField.OUTPUT_AMOUNT, newToken),
    [handleSomeTokenChange]
  );

  const handleSwapButtonClick = useCallback(() => {
    setValues(prevState => ({
      ...prevState,
      inputToken: outputToken,
      outputToken: inputToken,
      inputAmount: outputAmount
    }));
    onSwapPairChange({ inputToken: outputToken, outputToken: inputToken });
    onInputAmountChange(outputAmount);
    if (inputToken && outputToken) {
      onTokensSelected(outputToken, inputToken);
    }
  }, [setValues, inputToken, outputToken, outputAmount, onTokensSelected, onSwapPairChange, onInputAmountChange]);

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

  const handleSlippageChange = (newValue?: BigNumber) => {
    setFieldTouched(SwapField.SLIPPAGE, true);
    setFieldValue(SwapField.SLIPPAGE, newValue, true);
  };

  const handleDeadlineChange = (newValue?: BigNumber) => {
    setFieldTouched(SwapField.DEADLINE, true);
    setFieldValue(SwapField.DEADLINE, newValue, true);
  };

  const inputTokenSlug = inputToken && getTokenSlug(inputToken);
  const outputTokenSlug = outputToken && getTokenSlug(outputToken);
  const inputTokenBalance = getBalanceByTokenSlug(inputTokenSlug, balances);
  const outputTokenBalance = getBalanceByTokenSlug(outputTokenSlug, balances);

  const touchedFieldsErrors = Object.entries(touched).reduce<Partial<Record<keyof SwapFormValues, string>>>(
    (errorsPart, [key, isTouched]) => ({
      ...errorsPart,
      [key]: isTouched ? errors[key as keyof SwapFormValues] : undefined
    }),
    {}
  );

  const shouldShowDeadlineInput = !dexRoute || dexRoute?.some(({ type }) => type === 'ttdex');
  const shouldHideExchangeRates = network.type === 'test';
  const swapInputError = touchedFieldsErrors[SwapField.INPUT_TOKEN] ?? touchedFieldsErrors[SwapField.INPUT_AMOUNT];
  const swapOutputError = touchedFieldsErrors[SwapField.OUTPUT_TOKEN] ?? touchedFieldsErrors[SwapField.OUTPUT_AMOUNT];
  const inputExchangeRate =
    inputTokenSlug === undefined || shouldHideExchangeRates ? undefined : exchangeRates[inputTokenSlug];
  const outputExchangeRate =
    outputTokenSlug === undefined || shouldHideExchangeRates ? undefined : exchangeRates[outputTokenSlug];
  const submitDisabled = !isEmptyArray(Object.keys(errors)) || !accountPkh;

  return (
    <>
      {/* TODO: add swap chart */}
      <StickyBlock className={className}>
        <Card
          header={{
            content: <Tabs values={TabsContent} activeId={action!} setActiveId={handleTabSwitch} className={s.tabs} />,
            // TODO: add a button for transactions history
            className: s.header
          }}
          contentClassName={s.content}
        >
          <NewTokenSelect
            showBalanceButtons={!!accountPkh}
            amount={inputAmount}
            className={s.input}
            balance={inputTokenBalance}
            exchangeRate={inputExchangeRate}
            label="From"
            error={swapInputError}
            onAmountChange={handleInputAmountChange}
            token={inputToken}
            blackListedTokens={blackListedTokens}
            onTokenChange={handleInputTokenChange}
            id="swap-send-from"
            placeholder="0.0"
          />
          <SwapButton onClick={handleSwapButtonClick} />
          <NewTokenSelect
            showBalanceButtons={false}
            amount={outputAmount}
            className={cx(s.input, s.mb24)}
            balance={outputTokenBalance}
            exchangeRate={outputExchangeRate}
            label="To"
            error={swapOutputError}
            onAmountChange={handleOutputAmountChange}
            token={outputToken}
            blackListedTokens={blackListedTokens}
            onTokenChange={handleOutputTokenChange}
            id="swap-send-to"
            placeholder="0.0"
          />
          {action === 'send' && (
            <ComplexRecipient
              onChange={handleRecipientChangeFromEvent}
              value={recipient}
              handleInput={handleRecipientChange}
              label="Recipient address"
              id="swap-send-recipient"
              className={cx(s.input, s.mb24)}
              error={touchedFieldsErrors.recipient}
            />
          )}
          <SlippageInput
            error={touchedFieldsErrors.slippage}
            outputAmount={outputAmount}
            onChange={handleSlippageChange}
            slippage={slippage}
            outputToken={outputToken}
          />
          {shouldShowDeadlineInput && (
            <DeadlineInput error={touchedFieldsErrors.deadline} onChange={handleDeadlineChange} value={deadline} />
          )}
          <Button disabled={submitDisabled} type="submit" onClick={handleSubmit} className={s.button}>
            {currentTabLabel}
          </Button>
        </Card>
        <SwapDetails
          currentTab={currentTabLabel}
          fee={swapFee}
          priceImpact={priceImpact}
          inputToken={inputToken}
          outputToken={outputToken}
          route={dexRoute}
          buyRate={buyRate}
          sellRate={sellRate}
        />
      </StickyBlock>
    </>
  );
};

export const SwapSend = (props: SwapSendProps) => (
  <SwapLimitsProvider>
    <OrdinarySwapSend {...props} />
  </SwapLimitsProvider>
);
