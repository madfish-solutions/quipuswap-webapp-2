import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import { Tabs, Card, Button, StickyBlock, SwapButton } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';

import { ComplexRecipient } from '@components/ui/ComplexInput';
import { NewTokenSelect } from '@components/ui/ComplexInput/new-token-select';
import { useDexGraph } from '@hooks/use-dex-graph';
import { useInitialTokensSlugs } from '@hooks/use-initial-tokens-slugs';
import { useNewExchangeRates } from '@hooks/useNewExchangeRate';
import { useBalances } from '@providers/BalancesProvider';
import s from '@styles/CommonContainer.module.sass';
import { useAccountPkh, useOnBlock, useTezos, useTokens } from '@utils/dapp';
import {
  fromDecimals,
  getTokenIdFromSlug,
  getTokenOutput,
  getTokenSlug,
  makeWhitelistedToken,
  toDecimals
} from '@utils/helpers';
import { DexGraph, getMaxOutputRoute } from '@utils/routing';
import { WhitelistedToken, WhitelistedTokenMetadata } from '@utils/types';

import { SlippageInput } from './components/slippage-input';
import { SwapDetails } from './components/swap-details';
import { useSwapCalculations } from './hooks/use-swap-calculations';
import { useSwapDetails } from './hooks/use-swap-details';
import { useSwapFormik } from './hooks/use-swap-formik';
import { SwapLimitsProvider, useSwapLimits } from './providers/swap-limits-provider';
import { getBalanceByTokenSlug } from './utils/get-balance-by-token-slug';
import { SwapAmountField, SwapFormValues } from './utils/types';

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

const OrdinarySwapSend: FC<SwapSendProps & WithRouterProps> = ({ className, fromToSlug, router }) => {
  const {
    errors,
    values: { token1, token2, inputAmount, outputAmount, action, recipient, slippage },
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
    outputAmount: calculatedOutputAmount
  } = useSwapCalculations();

  useEffect(() => {
    setFieldValue('inputAmount', calculatedInputAmount);
    setFieldValue('outputAmount', calculatedOutputAmount);
  }, [calculatedInputAmount, calculatedOutputAmount, setFieldValue]);

  const { swapFee, priceImpact, buyRate, sellRate } = useSwapDetails({
    inputToken: token1,
    outputToken: token2,
    inputAmount,
    outputAmount,
    slippageTolerance: slippage,
    dexRoute,
    recipient
  });

  const onTokensSelected = useCallback(
    (token1: WhitelistedToken, token2: WhitelistedToken) => {
      updateSwapLimits(token1, token2);
      const newRoute = `/swap/${getTokenSlug(token1)}-${getTokenSlug(token2)}`;
      if (router.asPath !== newRoute) {
        router.replace(newRoute);
      }
    },
    [router, updateSwapLimits]
  );

  const { balances, updateBalance } = useBalances();
  const exchangeRates = useNewExchangeRates();
  const tezos = useTezos();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const { label: currentTabLabel } = TabsContent.find(({ id }) => id === action)!;

  const { dexGraph } = useDexGraph();
  const prevDexGraphRef = useRef<DexGraph>();
  const prevInitialFromRef = useRef<string>();
  const prevInitialToRef = useRef<string>();
  const prevAccountPkh = useRef<string | null>(null);

  useEffect(() => void validateField('inputAmount'), [validateField, maxInputAmounts, balances]);
  useEffect(() => void validateField('outputAmount'), [validateField, maxOutputAmounts]);

  const updateSelectedTokensBalances = useCallback(() => {
    Promise.all(
      [token1, token2].map(async token => {
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
  }, [token1, token2, updateBalance]);

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
        valuesToChange.token1 = makeWhitelistedToken(getTokenIdFromSlug(initialFrom), tokens);
      }
      if (initialTo) {
        valuesToChange.token2 = makeWhitelistedToken(getTokenIdFromSlug(initialTo), tokens);
      }
      setValues(prevValues => ({ ...prevValues, ...valuesToChange }));
      onSwapPairChange({
        inputToken: valuesToChange.token1 ?? token1,
        outputToken: valuesToChange.token2 ?? token2
      });
    }
  }, [initialFrom, initialTo, setValues, tokens, onSwapPairChange, token1, token2]);

  useEffect(() => {
    if (token1 && token2) {
      const token1Slug = getTokenSlug(token1);
      const token2Slug = getTokenSlug(token2);
      const newToken1 = tokens.find(token => token1Slug === getTokenSlug(token));
      const newToken2 = tokens.find(token => token2Slug === getTokenSlug(token));
      if (
        newToken1 &&
        newToken2 &&
        (!tokensMetadataIsSame(token1, newToken1) || !tokensMetadataIsSame(token2, newToken2))
      ) {
        setValues(prevValues => ({
          ...prevValues,
          token1: newToken1,
          token2: newToken2
        }));
        onSwapPairChange({ inputToken: newToken1, outputToken: newToken2 });
      }
    }
  }, [setValues, token1, token2, tokens, onSwapPairChange]);

  useEffect(() => {
    if (prevDexGraphRef.current !== dexGraph && token1 && token2) {
      updateSwapLimits(token1, token2);
    }
    prevDexGraphRef.current = dexGraph;
  }, [dexGraph, token1, token2, updateSwapLimits]);

  useOnBlock(tezos, updateSelectedTokensBalances);

  const handleSubmit = useCallback(() => {
    submitForm().then(() => {
      setFieldTouched('inputAmount', false);
      setFieldTouched('outputAmount', false);
      setValues(prevValues => ({ ...prevValues, inputAmount: undefined, outputAmount: undefined }));
      onInputAmountChange(undefined);
      onOutputAmountChange(undefined);
    });
  }, [setValues, submitForm, setFieldTouched, onInputAmountChange, onOutputAmountChange]);

  const handleTabSwitch = useCallback(
    (newTabId: string) => {
      const valuesToSet: Partial<SwapFormValues> = {
        action: newTabId as SwapFormValues['action']
      };
      if (newTabId === 'swap') {
        valuesToSet.recipient = undefined;
      }

      setValues(prevValues => ({ ...prevValues, ...valuesToSet }));
    },
    [setValues]
  );

  const blackListedTokens = useMemo(() => [token1, token2].filter((x): x is WhitelistedToken => !!x), [token1, token2]);

  const handleInputAmountChange = (newAmount?: BigNumber) => {
    setFieldTouched('inputAmount', true);
    setFieldValue('inputAmount', newAmount, true);
    onInputAmountChange(newAmount);
  };
  const handleOutputAmountChange = (newAmount?: BigNumber) => {
    setFieldTouched('outputAmount', true);
    setFieldValue('outputAmount', newAmount, true);
    onOutputAmountChange(newAmount);
  };

  const handleSomeTokenChange = useCallback(
    (fieldName: 'token1' | 'token2', amountFieldName: SwapAmountField, newToken?: WhitelistedToken) => {
      setFieldTouched(fieldName, true);
      const valuesToSet: Partial<SwapFormValues> = {
        [fieldName]: newToken
      };
      const amount = amountFieldName === 'inputAmount' ? inputAmount : outputAmount;
      if (newToken && amount) {
        setFieldTouched(amountFieldName, true);
        valuesToSet[amountFieldName] = amount.decimalPlaces(newToken.metadata.decimals);
      }
      setValues(prevValues => ({ ...prevValues, ...valuesToSet }));
      if (newToken) {
        updateBalance(newToken);
      }
      const newToken1 = fieldName === 'token1' ? newToken : token1;
      const newToken2 = fieldName === 'token2' ? newToken : token2;
      onSwapPairChange({ inputToken: newToken1, outputToken: newToken2 });
      if (newToken1 && newToken2) {
        onTokensSelected(newToken1, newToken2);
      }
    },
    [
      setValues,
      updateBalance,
      setFieldTouched,
      inputAmount,
      outputAmount,
      token1,
      token2,
      onTokensSelected,
      onSwapPairChange
    ]
  );

  const handleToken1Change = useCallback(
    (newToken?: WhitelistedToken) => {
      handleSomeTokenChange('token1', 'inputAmount', newToken);
    },
    [handleSomeTokenChange]
  );
  const handleToken2Change = useCallback(
    (newToken?: WhitelistedToken) => handleSomeTokenChange('token2', 'outputAmount', newToken),
    [handleSomeTokenChange]
  );

  const handleSwapButtonClick = useCallback(() => {
    setValues(prevState => ({
      ...prevState,
      token1: token2,
      token2: token1,
      inputAmount: outputAmount
    }));
    onSwapPairChange({ inputToken: token2, outputToken: token1 });
    onInputAmountChange(outputAmount);
    if (token1 && token2) {
      onTokensSelected(token2, token1);
    }
  }, [setValues, token1, token2, outputAmount, onTokensSelected, onSwapPairChange, onInputAmountChange]);

  const handleRecipientChange = useCallback(
    (newValue: string) => {
      setFieldTouched('recipient', true);
      setFieldValue('recipient', newValue, true);
    },
    [setFieldValue, setFieldTouched]
  );

  const handleRecipientChangeFromEvent = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => handleRecipientChange(e.currentTarget.value),
    [handleRecipientChange]
  );

  const handleSlippageChange = useCallback(
    (newValue?: BigNumber) => {
      setFieldTouched('slippage', true);
      setFieldValue('slippage', newValue, true);
    },
    [setFieldValue, setFieldTouched]
  );

  const token1Slug = token1 && getTokenSlug(token1);
  const token2Slug = token2 && getTokenSlug(token2);
  const token1Balance = getBalanceByTokenSlug(token1Slug, balances);
  const token2Balance = getBalanceByTokenSlug(token2Slug, balances);

  const touchedFieldsErrors = Object.keys(touched).reduce<Partial<Record<keyof SwapFormValues, string>>>(
    (errorsPart, key) => ({
      ...errorsPart,
      [key]: errors[key as keyof SwapFormValues]
    }),
    {}
  );

  const swapInputError = touchedFieldsErrors.token1 ?? touchedFieldsErrors.inputAmount;
  const swapOutputError = touchedFieldsErrors.token2 ?? touchedFieldsErrors.outputAmount;
  const inputExchangeRate = token1Slug === undefined ? undefined : exchangeRates[token1Slug];
  const outputExchangeRate = token2Slug === undefined ? undefined : exchangeRates[token2Slug];
  const submitDisabled = Object.keys(errors).length > 0 || !accountPkh;

  const generalMaxOutputAmount = token1Slug && token2Slug ? maxOutputAmounts[token1Slug]?.[token2Slug] : undefined;
  const maxOutputAmountByBalance = useMemo(() => {
    if (dexGraph && token1 && token1Balance && token2) {
      const route = getMaxOutputRoute(
        {
          startTokenSlug: getTokenSlug(token1),
          endTokenSlug: getTokenSlug(token2),
          graph: dexGraph
        },
        token1Balance
      );
      if (route) {
        try {
          return fromDecimals(
            getTokenOutput({
              inputToken: token1,
              inputAmount: toDecimals(token1Balance, token1),
              dexChain: route
            }),
            token2
          );
        } catch (e) {
          return undefined;
        }
      }
    }

    return undefined;
  }, [dexGraph, token1, token1Balance, token2]);
  const maxOutput = maxOutputAmountByBalance ?? generalMaxOutputAmount;

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
            balance={token1Balance}
            exchangeRate={inputExchangeRate}
            label="From"
            error={swapInputError}
            onAmountChange={handleInputAmountChange}
            token={token1}
            blackListedTokens={blackListedTokens}
            onTokenChange={handleToken1Change}
            id="swap-send-from"
          />
          <SwapButton onClick={handleSwapButtonClick} />
          <NewTokenSelect
            showBalanceButtons={!!accountPkh}
            amount={outputAmount}
            className={cx(s.input, s.mb24)}
            balance={token2Balance}
            maxValue={maxOutput}
            exchangeRate={outputExchangeRate}
            label="To"
            error={swapOutputError}
            onAmountChange={handleOutputAmountChange}
            token={token2}
            blackListedTokens={blackListedTokens}
            onTokenChange={handleToken2Change}
            id="swap-send-from"
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
            outputToken={token2}
          />
          <Button disabled={submitDisabled} type="submit" onClick={handleSubmit} className={s.button}>
            {currentTabLabel}
          </Button>
        </Card>
        <SwapDetails
          currentTab={currentTabLabel}
          fee={swapFee}
          priceImpact={priceImpact}
          inputToken={token1}
          outputToken={token2}
          route={dexRoute}
          buyRate={buyRate}
          sellRate={sellRate}
        />
      </StickyBlock>
    </>
  );
};

export const SwapSend = withRouter<SwapSendProps & WithRouterProps>(props => (
  <SwapLimitsProvider>
    <OrdinarySwapSend {...props} />
  </SwapLimitsProvider>
));
