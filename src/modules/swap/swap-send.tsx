import { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';

import { MAX_HOPS_COUNT } from '@config/constants';
import { useBalances } from '@providers/balances-provider';
import { useTokens } from '@providers/dapp-tokens';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import {
  Button,
  Card,
  ComplexRecipient,
  ConnectWalletButton,
  PageTitle,
  SettingsButton,
  StickyBlock,
  SwapButton,
  Tabs,
  TestnetAlert
} from '@shared/components';
import { ComplexError } from '@shared/components/ComplexInput/ComplexError';
import complexInputStyles from '@shared/components/ComplexInput/ComplexInput.module.scss';
import { NewTokenSelect } from '@shared/components/ComplexInput/new-token-select';
import {
  amountsAreEqual,
  defined,
  DexGraph,
  FormatNumber,
  getTokenPairSlug,
  getTokenSlug,
  getTokensOptionalPairName,
  isEmptyArray,
  makeSwapOrSendRedirectionUrl
} from '@shared/helpers';
import { makeToken } from '@shared/helpers/makers/make-token';
import { getTokenIdFromSlug } from '@shared/helpers/tokens/get-token-id-from-slug';
import { useDexGraph, useOnBlock } from '@shared/hooks';
import { useInitialTokensSlugs } from '@shared/hooks/use-initial-tokens-slugs';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { SwapTabAction, Token, TokenMetadata, Undefined } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { SwapDetails } from './components/swap-details/swap-details';
import { useSwapCalculations } from './hooks/use-swap-calculations';
import { useSwapDetails } from './hooks/use-swap-details';
import { useSwapFormik } from './hooks/use-swap-formik';
import { SwapLimitsProvider, useSwapLimits } from './providers/swap-limits-provider';
import { getBalanceByTokenSlug } from './utils/get-balance-by-token-slug';
import { SwapAmountFieldName, SwapField, SwapFormValues, SwapTokensFieldName } from './utils/types';

interface SwapSendProps {
  className?: string;
  initialAction?: SwapTabAction;
}

function tokensMetadataIsSame(token1: Token, token2: Token) {
  const propsToCompare: (keyof TokenMetadata)[] = ['decimals', 'name', 'symbol', 'thumbnailUri'];

  return propsToCompare.every(propName => token1.metadata[propName] === token2.metadata[propName]);
}

const PRICE_IMPACT_WARNING_THRESHOLD = 10;

// eslint-disable-next-line sonarjs/cognitive-complexity
const OrdinarySwapSend: FC<SwapSendProps> = ({ className, initialAction }) => {
  const exchangeRates = useNewExchangeRates();
  const {
    dexRoute,
    onInputAmountChange,
    onOutputAmountChange,
    onSwapPairChange,
    inputAmount: calculatedInputAmount,
    outputAmount: calculatedOutputAmount,
    resetCalculations
  } = useSwapCalculations();
  const {
    errors,
    values: { inputToken, outputToken, inputAmount, outputAmount, action, recipient },
    isSubmitting,
    validateField,
    setValues,
    setFieldValue,
    setFieldTouched,
    submitForm,
    touched
  } = useSwapFormik(initialAction, dexRoute, exchangeRates);
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation(['swap']);
  const fromToSlug = (params.fromTo as string) ?? '';
  const { maxInputAmounts, maxOutputAmounts, updateSwapLimits } = useSwapLimits();
  const {
    settings: { tradingSlippage }
  } = useSettingsStore();

  const getRedirectionUrl = useCallback(
    (from: string, to: string) => makeSwapOrSendRedirectionUrl({ from, to }, action),
    [action]
  );
  const [initialFrom, initialTo] = useInitialTokensSlugs(fromToSlug, getRedirectionUrl) ?? [];

  const TabsContent = [
    { id: SwapTabAction.SWAP, label: t('swap|Swap') },
    { id: SwapTabAction.SEND, label: t('swap|Send') }
  ];

  const prevCalculatedInputAmountRef = useRef(calculatedInputAmount);
  const prevCalculatedOutputAmountRef = useRef(calculatedOutputAmount);

  useEffect(() => {
    if (!amountsAreEqual(calculatedInputAmount, prevCalculatedInputAmountRef.current)) {
      setFieldValue(SwapField.INPUT_AMOUNT, calculatedInputAmount).then(() => {
        validateField(SwapField.INPUT_AMOUNT);
        if (calculatedInputAmount) {
          setFieldTouched(SwapField.INPUT_AMOUNT, true);
        }
      });
      prevCalculatedInputAmountRef.current = calculatedInputAmount;
    }
    if (!amountsAreEqual(calculatedOutputAmount, prevCalculatedOutputAmountRef.current)) {
      setFieldValue(SwapField.OUTPUT_AMOUNT, calculatedOutputAmount);
      prevCalculatedOutputAmountRef.current = calculatedOutputAmount;
    }
  }, [
    calculatedInputAmount,
    calculatedOutputAmount,
    inputAmount,
    outputAmount,
    setFieldValue,
    setFieldTouched,
    validateField
  ]);

  const { swapFee, swapFeeError, priceImpact, buyRate, sellRate } = useSwapDetails({
    inputToken,
    outputToken,
    inputAmount,
    outputAmount,
    slippageTolerance: tradingSlippage,
    dexRoute,
    recipient
  });

  const onTokensSelected = useCallback(
    (_inputToken: Token, _outputToken: Token) => {
      updateSwapLimits(_inputToken, _outputToken);
      const newRoute = `/${action}/${getTokenPairSlug(_inputToken, _outputToken)}`;

      navigate(newRoute);
    },
    [action, navigate, updateSwapLimits]
  );

  const { balances, updateBalance } = useBalances();
  const tezos = useTezos();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const { label: currentTabLabel } = TabsContent.find(({ id }) => id === action)!;

  const { dexGraph, dataIsStale, refreshDexPools, dexPoolsLoading } = useDexGraph();
  const prevDexGraphRef = useRef<DexGraph>();
  const prevInitialFromRef = useRef<string>();
  const prevInitialToRef = useRef<string>();
  const prevAccountPkh = useRef<string | null>(null);

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
          [SwapField.INPUT_TOKEN]: newInputToken,
          [SwapField.OUTPUT_TOKEN]: newOutputToken
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
            from: inputToken && getTokenSlug(inputToken),
            to: outputToken && getTokenSlug(outputToken)
          },
          valuesToSet.action
        )
      );
    },
    [setValues, navigate, inputToken, outputToken]
  );

  const blackListedTokens = useMemo(
    () => [inputToken, outputToken].filter((x): x is Token => !!x),
    [inputToken, outputToken]
  );

  const handleInputAmountChange = (newAmount: Undefined<BigNumber>) => {
    refreshDexPoolsIfNecessary();
    setFieldTouched(SwapField.INPUT_AMOUNT, true);
    setFieldValue(SwapField.INPUT_AMOUNT, newAmount, true);
    onInputAmountChange(newAmount);
  };
  const handleOutputAmountChange = (newAmount: Undefined<BigNumber>) => {
    refreshDexPoolsIfNecessary();
    setFieldTouched(SwapField.OUTPUT_AMOUNT, true);
    setFieldValue(SwapField.OUTPUT_AMOUNT, newAmount, true);
    onOutputAmountChange(newAmount);
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
      inputToken: outputToken,
      outputToken: inputToken,
      inputAmount: outputAmount
    }));
    onSwapPairChange({ inputToken: outputToken, outputToken: inputToken });
    onInputAmountChange(outputAmount);
    if (inputToken && outputToken) {
      onTokensSelected(outputToken, inputToken);
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

  const swapInputError = touchedFieldsErrors[SwapField.INPUT_TOKEN] ?? touchedFieldsErrors[SwapField.INPUT_AMOUNT];
  const swapOutputError = touchedFieldsErrors[SwapField.OUTPUT_TOKEN] ?? touchedFieldsErrors[SwapField.OUTPUT_AMOUNT];
  const inputExchangeRate = inputTokenSlug === undefined ? undefined : exchangeRates[inputTokenSlug];
  const outputExchangeRate = outputTokenSlug === undefined ? undefined : exchangeRates[outputTokenSlug];
  const submitDisabled = !isEmptyArray(Object.keys(errors));

  const title = `${t('swap|Swap')} ${getTokensOptionalPairName(inputToken, outputToken)}`;
  const noRouteFound = !dexRoute && inputToken && outputToken && (inputAmount || outputAmount);
  const shouldShowPriceImpactWarning = priceImpact?.gt(PRICE_IMPACT_WARNING_THRESHOLD);

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="swapPageTitle">{title}</PageTitle>
      <StickyBlock className={className}>
        <Card
          header={{
            content: (
              <Tabs
                values={TabsContent}
                activeId={defined(action)}
                setActiveId={handleTabSwitch}
                className={styles.tabs}
              />
            ),
            button: <SettingsButton colored />,
            // TODO: add a button for transactions history
            className: styles.header
          }}
          contentClassName={styles.content}
          data-test-id="swapPageTokenSelect"
        >
          <NewTokenSelect
            showBalanceButtons={!!accountPkh}
            amount={inputAmount}
            className={styles.input}
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
            data-test-id="from"
          />
          <SwapButton onClick={handleSwapButtonClick} />
          <NewTokenSelect
            showBalanceButtons={false}
            amount={outputAmount}
            className={cx(styles.input)}
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
            data-test-id="to"
          />
          {action === 'send' && (
            <ComplexRecipient
              onChange={handleRecipientChangeFromEvent}
              value={recipient}
              handleInput={handleRecipientChange}
              label="Recipient address"
              id="swap-send-recipient"
              className={cx(styles.input, styles.mb24)}
              error={touchedFieldsErrors.recipient}
            />
          )}
          <div className={cx({ [complexInputStyles.error]: noRouteFound })}>
            <ComplexError
              error={t('swap|noRouteFoundError', { maxHopsCount: MAX_HOPS_COUNT })}
              data-test-id="noRouteFound"
            />
          </div>
          <div className={cx({ [complexInputStyles.error]: shouldShowPriceImpactWarning })}>
            <ComplexError
              error={t('swap|priceImpactWarning', {
                priceImpact: FormatNumber(priceImpact ?? PRICE_IMPACT_WARNING_THRESHOLD)
              })}
              data-test-id="shouldShowPriceImpactWarning"
            />
          </div>
          {!accountPkh && <ConnectWalletButton className={styles.button} />}
          {accountPkh && dataIsStale && !isSubmitting && (
            <Button
              loading={dexPoolsLoading}
              onClick={refreshDexPools}
              className={styles.button}
              data-test-id="updateRatesButton"
            >
              {t('swap|Update Rates')}
            </Button>
          )}
          {accountPkh && (!dataIsStale || isSubmitting) && (
            <Button
              disabled={submitDisabled}
              loading={isSubmitting}
              type="submit"
              onClick={handleSubmit}
              className={styles.button}
            >
              {currentTabLabel}
            </Button>
          )}
        </Card>
        <SwapDetails
          fee={swapFee}
          feeError={swapFeeError}
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

export const SwapSend = (props: SwapSendProps) => {
  return (
    <SwapLimitsProvider>
      <OrdinarySwapSend {...props} />
    </SwapLimitsProvider>
  );
};
