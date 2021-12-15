import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Tabs, Card, Button, Slippage, StickyBlock, SwapButton, CurrencyAmount } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import debouncePromise from 'debounce-promise';
import { FormikProps } from 'formik';

import { ComplexRecipient } from '@components/ui/ComplexInput';
import { NewTokenSelect } from '@components/ui/ComplexInput/NewTokenSelect';
import { makeWhitelistedToken, useDexGraph } from '@hooks/useDexGraph';
import { useNewExchangeRates } from '@hooks/useNewExchangeRate';
import { useBalances } from '@providers/BalancesProvider';
import s from '@styles/CommonContainer.module.sass';
import { useAccountPkh, useNetwork, useOnBlock, useTezos, useTokens } from '@utils/dapp';
import { DEFAULT_SLIPPAGE_PERCENTAGE, TEZOS_TOKEN, TTDEX_CONTRACTS } from '@utils/defaults';
import {
  estimateSwapFee,
  fromDecimals,
  getPriceImpact,
  getTokenIdFromSlug,
  getTokenInput,
  getTokenOutput,
  getTokenSlug,
  getWhitelistedTokenSymbol,
  toDecimals
} from '@utils/helpers';
import { DexGraph, getMaxOutputRoute, getRouteWithInput, getRouteWithOutput } from '@utils/routing';
import { DexPair, SwapFormValues, WhitelistedToken, WhitelistedTokenMetadata } from '@utils/types';

import { SwapDetails } from './SwapDetails';

interface SwapFormProps extends FormikProps<Partial<SwapFormValues>> {
  className?: string;
  submitError?: string;
  updateSwapLimits: (token1: WhitelistedToken, token2: WhitelistedToken) => void;
  onTokensSelected: (token1: WhitelistedToken, token2: WhitelistedToken) => void;
  maxInputAmounts: Record<string, Record<string, BigNumber>>;
  maxOutputAmounts: Record<string, Record<string, BigNumber>>;
  initialFrom?: string;
  initialTo?: string;
}

interface SlippageInputProps {
  error?: string;
  outputAmount?: BigNumber;
  outputToken?: WhitelistedToken;
  onChange: (newValue?: BigNumber) => void;
  slippage?: BigNumber;
}

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

const WHOLE_ITEM_PERCENT = 100;
const DEBOUNCE_DELAY = 250;

const getBalanceByTokenSlug = (tokenSlug: string | undefined, balances: Record<string, BigNumber>) => {
  if (tokenSlug === undefined) {
    return undefined;
  }

  return balances[tokenSlug];
};

const SlippageInput: FC<SlippageInputProps> = ({ error, outputAmount, onChange, slippage, outputToken }) => {
  const handleChange = (newValue?: string) => {
    if (!newValue) {
      onChange(new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE));
    } else {
      const parsedPercentage = new BigNumber(newValue);
      onChange(parsedPercentage.isFinite() ? parsedPercentage : undefined);
    }
  };

  const tokenDecimals = outputToken?.metadata.decimals ?? 0;

  const minimumReceived = useMemo(
    () =>
      slippage && outputAmount
        ? outputAmount
            .times(new BigNumber(1).minus(slippage.div(WHOLE_ITEM_PERCENT)))
            .decimalPlaces(tokenDecimals, BigNumber.ROUND_FLOOR)
        : new BigNumber(0),
    [slippage, outputAmount, tokenDecimals]
  );

  return (
    <>
      <Slippage handleChange={handleChange} placeholder={slippage?.toFixed()} />
      {error && <div className={s.simpleError}>{error}</div>}
      <div className={s.receive}>
        {slippage && (
          <>
            <span className={s.receiveLabel}>Minimum received:</span>
            <CurrencyAmount
              amount={minimumReceived.toFixed()}
              currency={outputToken ? getWhitelistedTokenSymbol(outputToken) : ''}
            />
          </>
        )}
      </div>
    </>
  );
};

function amountsAreEqual(amount1?: BigNumber, amount2?: BigNumber) {
  if (amount1 && amount2) {
    return amount1.eq(amount2);
  }

  return amount1 === amount2;
}

function tokensMetadataIsSame(token1: WhitelistedToken, token2: WhitelistedToken) {
  const propsToCompare: (keyof WhitelistedTokenMetadata)[] = ['decimals', 'name', 'symbol', 'thumbnailUri'];

  return propsToCompare.every(propName => token1.metadata[propName] === token2.metadata[propName]);
}

export const SwapForm: FC<SwapFormProps> = ({
  className,
  errors,
  initialFrom,
  initialTo,
  maxInputAmounts,
  maxOutputAmounts,
  onTokensSelected,
  submitForm,
  setValues,
  setFieldValue,
  submitError,
  setFieldTouched,
  touched,
  updateSwapLimits,
  validateField,
  values
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { token1, token2, amount1, amount2, recipient, slippage, action } = values;

  const { balances, updateBalance } = useBalances();
  const exchangeRates = useNewExchangeRates();
  const network = useNetwork();
  const tezos = useTezos();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const { label: currentTabLabel } = TabsContent.find(({ id }) => id === action)!;

  const { dexGraph } = useDexGraph();
  const [fee, setFee] = useState<BigNumber>();
  const [dexRoute, setDexRoute] = useState<DexPair[]>();
  const prevToken1Ref = useRef<WhitelistedToken>();
  const prevToken2Ref = useRef<WhitelistedToken>();
  const prevAmount1Ref = useRef<BigNumber>();
  const prevAmount2Ref = useRef<BigNumber>();
  const prevDexGraphRef = useRef<DexGraph>();
  const prevInitialFromRef = useRef<string>();
  const prevInitialToRef = useRef<string>();
  const prevAccountPkh = useRef<string | null>(null);

  useEffect(() => validateField('amount1'), [validateField, maxInputAmounts, balances]);
  useEffect(() => validateField('amount2'), [validateField, maxOutputAmounts]);

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
        const { contractAddress, type: tokenType, fa2TokenId } = getTokenIdFromSlug(initialFrom);
        valuesToChange.token1 = makeWhitelistedToken(
          {
            address: contractAddress,
            type: tokenType,
            id: fa2TokenId === undefined ? undefined : String(fa2TokenId)
          },
          tokens
        );
      }
      if (initialTo) {
        const { contractAddress, type: tokenType, fa2TokenId } = getTokenIdFromSlug(initialTo);
        valuesToChange.token2 = makeWhitelistedToken(
          {
            address: contractAddress,
            type: tokenType,
            id: fa2TokenId === undefined ? undefined : String(fa2TokenId)
          },
          tokens
        );
      }
      setValues(prevValues => ({ ...prevValues, ...valuesToChange }));
    }
  }, [initialFrom, initialTo, setValues, tokens]);

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
      }
    }
  }, [setValues, token1, token2, tokens]);

  const updateSwapFee = useMemo(
    () =>
      debouncePromise((inputAmount: BigNumber, route: DexPair[]) => {
        if (!accountPkh || !token1) {
          return;
        }
        estimateSwapFee(tezos!, accountPkh, {
          inputToken: token1,
          inputAmount: toDecimals(inputAmount, token1),
          dexChain: route,
          recipient,
          slippageTolerance: slippage?.div(WHOLE_ITEM_PERCENT),
          ttDexAddress: TTDEX_CONTRACTS[network.id]
        })
          .then(newFee => setFee(fromDecimals(newFee, TEZOS_TOKEN)))
          .catch(e => {
            setFee(undefined);
          });
      }, DEBOUNCE_DELAY),
    [accountPkh, network.id, recipient, slippage, tezos, token1]
  );

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const prevToken1 = prevToken1Ref.current;
    const prevToken2 = prevToken2Ref.current;
    const prevAmount1 = prevAmount1Ref.current;
    const prevAmount2 = prevAmount2Ref.current;
    const prevToken1Slug = prevToken1 && getTokenSlug(prevToken1);
    const prevToken2Slug = prevToken2 && getTokenSlug(prevToken2);
    const prevDexGraph = prevDexGraphRef.current;
    prevToken1Ref.current = token1;
    prevToken2Ref.current = token2;
    prevAmount1Ref.current = amount1;
    prevAmount2Ref.current = amount2;
    prevDexGraphRef.current = dexGraph;

    if (prevDexGraph !== dexGraph && token1 && token2) {
      updateSwapLimits(token1, token2);
    }

    if (token1 && token2 && dexGraph) {
      const token1Slug = getTokenSlug(token1);
      const token2Slug = getTokenSlug(token2);
      const inputChanged = prevToken1Slug !== token1Slug || !amountsAreEqual(prevAmount1, amount1);
      const outputTokenChanged = prevToken2Slug !== token2Slug;
      const outputAmountChanged = !amountsAreEqual(prevAmount2, amount2);
      const shouldUpdateOutputAmountOnValuesChange = inputChanged || outputTokenChanged;
      const shouldUpdateInputAmountOnValuesChange = outputAmountChanged;
      if (shouldUpdateOutputAmountOnValuesChange || prevDexGraph !== dexGraph) {
        let route: DexPair[] | undefined;
        let outputAmount: BigNumber | undefined;
        if (amount1) {
          route = getRouteWithInput({
            startTokenSlug: token1Slug,
            endTokenSlug: token2Slug,
            graph: dexGraph,
            inputAmount: toDecimals(amount1, token1)
          });
          if (route) {
            try {
              outputAmount = fromDecimals(
                getTokenOutput({
                  inputToken: token1,
                  inputAmount: toDecimals(amount1, token1),
                  dexChain: route
                }),
                token2
              );
            } catch (_) {
              // ignore error
            }
          }
        }
        setDexRoute(route);
        prevAmount2Ref.current = outputAmount;
        if (outputAmount) {
          setFieldTouched('amount2', true);
        }
        setFieldValue('amount2', outputAmount, true);
        if (accountPkh && amount1 && route) {
          updateSwapFee(amount1, route);
        } else {
          setFee(undefined);
        }
      } else if (shouldUpdateInputAmountOnValuesChange) {
        let route: DexPair[] | undefined;
        let inputAmount: BigNumber | undefined;
        if (amount2) {
          route = getRouteWithOutput({
            startTokenSlug: token1Slug,
            endTokenSlug: token2Slug,
            graph: dexGraph,
            outputAmount: amount2
          });
          if (route) {
            try {
              inputAmount = fromDecimals(getTokenInput(token2, toDecimals(amount2, token2), route), token1);
            } catch (_) {
              // ignore error
            }
          }
        }
        setDexRoute(route);
        prevAmount1Ref.current = inputAmount;
        if (inputAmount) {
          setFieldTouched('amount1', true);
        }
        setFieldValue('amount1', inputAmount, true);
        if (accountPkh && inputAmount && route) {
          updateSwapFee(inputAmount, route);
        } else {
          setFee(undefined);
        }
      }
    }
  }, [
    amount1,
    amount2,
    token1,
    token2,
    dexGraph,
    setFieldValue,
    setFieldTouched,
    accountPkh,
    tezos,
    recipient,
    slippage,
    updateSwapLimits,
    network.id,
    updateSwapFee
  ]);

  useOnBlock(tezos, updateSelectedTokensBalances);

  const handleSubmit = useCallback(() => {
    submitForm().then(() => {
      setFieldTouched('amount1', false);
      setFieldTouched('amount2', false);
      setValues(prevValues => ({ ...prevValues, amount1: undefined, amount2: undefined }));
      setFee(undefined);
    });
  }, [setValues, submitForm, setFieldTouched]);

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

  const handleAmount1Change = useCallback(
    (newAmount?: BigNumber) => {
      setFieldTouched('amount1', true);
      setFieldValue('amount1', newAmount, true);
    },
    [setFieldValue, setFieldTouched]
  );
  const handleAmount2Change = useCallback(
    (newAmount?: BigNumber) => {
      setFieldTouched('amount2', true);
      setFieldValue('amount2', newAmount, true);
    },
    [setFieldValue, setFieldTouched]
  );

  const handleSomeTokenChange = useCallback(
    (fieldName: 'token1' | 'token2', amountFieldName: 'amount1' | 'amount2', newToken?: WhitelistedToken) => {
      setFieldTouched(fieldName, true);
      const valuesToSet: Partial<SwapFormValues> = {
        [fieldName]: newToken
      };
      const amount = amountFieldName === 'amount1' ? amount1 : amount2;
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
      if (newToken1 && newToken2) {
        onTokensSelected(newToken1, newToken2);
      }
    },
    [setValues, updateBalance, setFieldTouched, amount1, amount2, token1, token2, onTokensSelected]
  );

  const handleToken1Change = useCallback(
    (newToken?: WhitelistedToken) => {
      handleSomeTokenChange('token1', 'amount1', newToken);
    },
    [handleSomeTokenChange]
  );
  const handleToken2Change = useCallback(
    (newToken?: WhitelistedToken) => handleSomeTokenChange('token2', 'amount2', newToken),
    [handleSomeTokenChange]
  );

  const handleSwapButtonClick = useCallback(() => {
    setValues(prevState => ({
      ...prevState,
      token1: token2,
      token2: token1,
      amount1: amount2
    }));
    if (token1 && token2) {
      onTokensSelected(token2, token1);
    }
  }, [setValues, token1, token2, amount2, onTokensSelected]);

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

  const priceImpact = useMemo(
    () =>
      token1 && amount1 && dexRoute && slippage
        ? getPriceImpact({
            inputToken: token1,
            inputAmount: toDecimals(amount1, token1),
            dexChain: dexRoute,
            slippageTolerance: slippage?.div(WHOLE_ITEM_PERCENT),
            ttDexAddress: TTDEX_CONTRACTS[network.id]
          })
        : new BigNumber(0),
    [amount1, network.id, slippage, token1, dexRoute]
  );

  const token1Slug = token1 && getTokenSlug(token1);
  const token2Slug = token2 && getTokenSlug(token2);
  const token1Balance = getBalanceByTokenSlug(token1Slug, balances);
  const token2Balance = getBalanceByTokenSlug(token2Slug, balances);

  const token1Error = touched.token1 ? errors.token1 : undefined;
  const amount1Error = touched.amount1 ? errors.amount1 : undefined;
  const token2Error = touched.token2 ? errors.token2 : undefined;
  const amount2Error = touched.amount2 ? errors.amount2 : undefined;

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
            amount={amount1}
            className={s.input}
            balance={token1Balance}
            exchangeRate={token1Slug === undefined ? undefined : exchangeRates[token1Slug]}
            label="From"
            error={token1Error ?? amount1Error}
            onAmountChange={handleAmount1Change}
            token={token1}
            blackListedTokens={blackListedTokens}
            onTokenChange={handleToken1Change}
            id="swap-send-from"
          />
          <SwapButton onClick={handleSwapButtonClick} />
          <NewTokenSelect
            showBalanceButtons={!!accountPkh}
            amount={amount2}
            className={cx(s.input, s.mb24)}
            balance={token2Balance}
            maxValue={maxOutput}
            exchangeRate={token2Slug === undefined ? undefined : exchangeRates[token2Slug]}
            label="To"
            error={token2Error ?? amount2Error ?? submitError}
            onAmountChange={handleAmount2Change}
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
              error={touched.recipient ? errors.recipient : undefined}
            />
          )}
          <SlippageInput
            error={touched.slippage ? errors.slippage : undefined}
            outputAmount={amount2}
            onChange={handleSlippageChange}
            slippage={slippage}
            outputToken={token2}
          />
          <Button
            disabled={Object.keys(errors).length > 0 || !accountPkh}
            type="submit"
            onClick={handleSubmit}
            className={s.button}
          >
            {currentTabLabel}
          </Button>
        </Card>
        {token1 && token2 && (
          <SwapDetails
            currentTab={currentTabLabel}
            fee={(fee ?? 0).toString()}
            priceImpact={priceImpact}
            inputToken={token1}
            outputToken={token2}
            inputAmount={amount1}
            outputAmount={amount2}
            route={dexRoute}
          />
        )}
      </StickyBlock>
    </>
  );
};
