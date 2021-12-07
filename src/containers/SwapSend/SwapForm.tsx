import BigNumber from 'bignumber.js';
import cx from 'classnames';
import debouncePromise from 'debounce-promise';
import { FormikProps } from 'formik';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Tabs,
  Card,
  Button,
  Slippage,
  StickyBlock,
  SwapButton,
  Transactions,
  CurrencyAmount,
} from '@quipuswap/ui-kit';

import { ComplexRecipient } from '@components/ui/ComplexInput';
import { NewTokenSelect } from '@components/ui/ComplexInput/NewTokenSelect';
import { useDexGraph } from '@hooks/useDexGraph';
import { useNewExchangeRates } from '@hooks/useNewExchangeRate';
import {
  useAccountPkh,
  useAddCustomToken,
  useNetwork,
  useOnBlock,
  useSearchCustomTokens,
  useTezos,
  useTokens,
} from '@utils/dapp';
import { networksDefaultTokens, TEZOS_TOKEN, TTDEX_CONTRACTS } from '@utils/defaults';
import {
  estimateSwapFee,
  fromDecimals,
  getPriceImpact,
  getTokenInput,
  getTokenOutput,
  getTokenSlug,
  getWhitelistedTokenSymbol,
  slippageToBignum,
} from '@utils/helpers';
import {
  DexGraph,
  getRouteWithInput,
  getRouteWithOutput,
} from '@utils/routing';
import {
  DexPair,
  SwapFormValues,
  QSMainNet,
  WhitelistedToken,
} from '@utils/types';

import s from '@styles/CommonContainer.module.sass';

import { SwapChart } from './SwapChart';
import { SwapDetails } from './SwapDetails';

type SwapFormProps = FormikProps<Partial<SwapFormValues>> & {
  className?: string;
  submitError?: string;
  updateTokenBalance: (token: WhitelistedToken) => void;
  knownTokensBalances: Record<string, BigNumber>;
  onTokensSelected: (token1: WhitelistedToken, token2: WhitelistedToken) => void;
  knownMaxInputAmounts: Record<string, Record<string, BigNumber>>;
  knownMaxOutputAmounts: Record<string, Record<string, BigNumber>>;
  matchingNetwork?: QSMainNet;
  initialFrom?: string;
  initialTo?: string;
};

type SlippageInputProps = {
  outputAmount?: BigNumber;
  outputToken?: WhitelistedToken;
  onChange: (newValue?: BigNumber) => void;
  slippage?: BigNumber;
};

const TabsContent = [
  {
    id: 'swap',
    label: 'Swap',
  },
  {
    id: 'send',
    label: 'Send',
  },
];

const SlippageInput: React.FC<SlippageInputProps> = ({
  outputAmount,
  onChange,
  slippage,
  outputToken,
}) => {
  const handleChange = useCallback((newValue: string) => {
    const parsedPercentage = slippageToBignum(newValue);
    onChange(parsedPercentage.isFinite() ? parsedPercentage : undefined);
  }, [onChange]);

  const tokenDecimals = outputToken?.metadata.decimals ?? 0;

  const minimumReceived = useMemo(
    () => (slippage && outputAmount
      ? outputAmount.times(new BigNumber(1).minus(slippage.div(100)))
        .decimalPlaces(tokenDecimals, BigNumber.ROUND_FLOOR)
      : new BigNumber(0)
    ),
    [slippage, outputAmount, tokenDecimals],
  );

  return (
    <>
      <Slippage handleChange={handleChange} />
      <div className={s.receive}>
        <span className={s.receiveLabel}>
          Minimum received:
        </span>
        <CurrencyAmount
          amount={minimumReceived.toFixed()}
          currency={outputToken ? getWhitelistedTokenSymbol(outputToken) : ''}
        />
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

export const SwapForm: React.FC<SwapFormProps> = ({
  className,
  errors,
  initialFrom,
  initialTo,
  knownTokensBalances,
  knownMaxInputAmounts,
  knownMaxOutputAmounts,
  matchingNetwork,
  onTokensSelected,
  submitForm,
  setValues,
  setFieldValue,
  submitError,
  setFieldTouched,
  touched,
  updateTokenBalance,
  validateField,
  values,
}) => {
  const {
    token1,
    token2,
    amount1,
    amount2,
    recipient,
    slippage,
    action,
  } = values;
  const exchangeRates = useNewExchangeRates();
  const network = useNetwork();
  const tezos = useTezos();
  const { data: tokens } = useTokens();
  const searchCustomTokens = useSearchCustomTokens();
  const addCustomToken = useAddCustomToken();
  const accountPkh = useAccountPkh();
  const { label: currentTabLabel } = TabsContent.find(({ id }) => id === action)!;

  const { dexGraph } = useDexGraph();
  const [fee, setFee] = useState<BigNumber>();
  const [dexRoute, setDexRoute] = useState<DexPair[]>();
  const initialValuesAppliedRef = useRef(false);
  const prevToken1Ref = useRef<WhitelistedToken>();
  const prevToken2Ref = useRef<WhitelistedToken>();
  const prevAmount1Ref = useRef<BigNumber>();
  const prevAmount2Ref = useRef<BigNumber>();
  const prevDexGraphRef = useRef<DexGraph>();
  const prevNetworkIdRef = useRef(network.id);
  const prevAccountPkh = useRef<string | null>(null);

  useEffect(() => validateField('amount1'), [validateField, knownMaxInputAmounts]);
  useEffect(() => validateField('amount2'), [validateField, knownMaxOutputAmounts]);

  useEffect(() => {
    const prevNetworkId = prevNetworkIdRef.current;
    if ((network.id !== prevNetworkId) && (matchingNetwork === prevNetworkId)) {
      setValues((prevValues) => ({
        ...prevValues,
        token1: TEZOS_TOKEN,
        token2: networksDefaultTokens[network.id],
        amount1: undefined,
        amount2: undefined,
      }));
    }
    prevNetworkIdRef.current = network.id;
  }, [network.id, setValues, matchingNetwork]);

  useEffect(() => {
    if (prevAccountPkh.current !== accountPkh) {
      [token1, token2].forEach((token) => {
        if (token) {
          updateTokenBalance(token);
        }
      });
    }
    prevAccountPkh.current = accountPkh;
  }, [accountPkh, token1, token2, updateTokenBalance]);

  const tokensTouched = touched.token1 || touched.token2;

  useEffect(() => {
    if (initialValuesAppliedRef.current || tokensTouched || !initialFrom || !initialTo) {
      return;
    }

    const newToken1 = tokens.find((token) => getTokenSlug(token) === initialFrom);
    const newToken2 = tokens.find((token) => getTokenSlug(token) === initialTo);

    if (newToken1 && newToken2) {
      initialValuesAppliedRef.current = true;
      setValues((prevValues) => ({
        ...prevValues,
        token1: newToken1,
        token2: newToken2,
      }));
      onTokensSelected(newToken1, newToken2);
    }
  }, [
    initialFrom,
    initialTo,
    searchCustomTokens,
    tokens,
    tokensTouched,
    setValues,
    addCustomToken,
    onTokensSelected,
  ]);

  const updateSwapFee = useMemo(
    () => debouncePromise(
      (inputAmount: BigNumber, route: DexPair[]) => {
        if (!accountPkh || !token1) {
          return;
        }
        estimateSwapFee(
          tezos!,
          accountPkh,
          {
            inputToken: token1,
            inputAmount: fromDecimals(inputAmount, -token1!.metadata.decimals),
            dexChain: route,
            recipient,
            slippageTolerance: slippage?.div(100),
            ttDexAddress: TTDEX_CONTRACTS[network.id],
          },
        )
          .then((newFee) => setFee(fromDecimals(newFee, 6)))
          .catch((e) => {
            console.error(e);
            setFee(undefined);
          });
      },
      250,
    ),
    [accountPkh, network.id, recipient, slippage, tezos, token1],
  );

  useEffect(() => {
    const prevToken1 = prevToken1Ref.current;
    const prevToken2 = prevToken2Ref.current;
    const prevAmount1 = prevAmount1Ref.current;
    const prevAmount2 = prevAmount2Ref.current;
    const prevToken1Slug = prevToken1 && getTokenSlug(prevToken1);
    const prevToken2Slug = prevToken2 && getTokenSlug(prevToken2);
    const token1Slug = token1 && getTokenSlug(token1);
    const token2Slug = token2 && getTokenSlug(token2);
    const prevDexGraph = prevDexGraphRef.current;
    prevToken1Ref.current = token1;
    prevToken2Ref.current = token2;
    prevAmount1Ref.current = amount1;
    prevAmount2Ref.current = amount2;
    prevDexGraphRef.current = dexGraph;

    if ((prevDexGraph !== dexGraph) && token1 && token2) {
      onTokensSelected(token1, token2);
    }

    if (token1 && token2 && dexGraph) {
      const inputChanged = (prevToken1Slug !== token1Slug) || !amountsAreEqual(
        prevAmount1,
        amount1,
      );
      const outputTokenChanged = prevToken2Slug !== token2Slug;
      const outputAmountChanged = !amountsAreEqual(prevAmount2, amount2);
      const shouldUpdateOutputAmountOnValuesChange = (
        inputChanged || outputTokenChanged
      );
      const shouldUpdateInputAmountOnValuesChange = outputAmountChanged;
      if (shouldUpdateOutputAmountOnValuesChange || (prevDexGraph !== dexGraph)) {
        const route = amount1 && getRouteWithInput({
          startTokenSlug: token1Slug!,
          endTokenSlug: token2Slug!,
          graph: dexGraph,
          inputAmount: fromDecimals(amount1, -token1.metadata.decimals),
        });
        let outputAmount: BigNumber | undefined;
        if (route) {
          try {
            outputAmount = fromDecimals(
              getTokenOutput({
                inputToken: token1,
                inputAmount: fromDecimals(amount1!, -token1.metadata.decimals),
                dexChain: route,
              }),
              token2.metadata.decimals,
            );
            // eslint-disable-next-line no-empty
          } catch {}
        }
        setDexRoute(route);
        prevAmount2Ref.current = outputAmount;
        setFieldValue('amount2', outputAmount, true);
        if (accountPkh && amount1 && route) {
          updateSwapFee(amount1, route);
        } else {
          setFee(undefined);
        }
      } else if (shouldUpdateInputAmountOnValuesChange) {
        const route = amount2 && getRouteWithOutput({
          startTokenSlug: token1Slug!,
          endTokenSlug: token2Slug!,
          graph: dexGraph,
          outputAmount: amount2,
        });
        let inputAmount: BigNumber | undefined;
        if (route) {
          try {
            inputAmount = fromDecimals(
              getTokenInput(
                token2,
                fromDecimals(amount2!, -token2.metadata.decimals),
                route,
              ),
              token1.metadata.decimals,
            );
            // eslint-disable-next-line no-empty
          } catch {}
        }
        setDexRoute(route);
        prevAmount1Ref.current = inputAmount;
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
    accountPkh,
    tezos,
    recipient,
    slippage,
    onTokensSelected,
    network.id,
    updateSwapFee,
  ]);

  const onBlockCallback = useCallback(() => {
    [token1, token2].forEach((token) => {
      if (token) {
        updateTokenBalance(token);
      }
    });
  }, [token1, token2, updateTokenBalance]);
  useOnBlock(tezos, onBlockCallback);

  const handleSubmit = useCallback(
    () => {
      submitForm().then(
        () => {
          setFieldTouched('amount1', false);
          setFieldTouched('amount2', false);
          setValues((prevValues) => ({ ...prevValues, amount1: undefined, amount2: undefined }));
        },
      ).catch(console.error);
    },
    [setValues, submitForm, setFieldTouched],
  );

  const handleTabSwitch = useCallback(
    (newTabId: string) => {
      const valuesToSet: Partial<SwapFormValues> = {
        action: newTabId as SwapFormValues['action'],
      };
      if (newTabId === 'swap') {
        valuesToSet.recipient = undefined;
      }

      setValues((prevValues) => ({ ...prevValues, ...valuesToSet }));
    },
    [setValues],
  );

  const blackListedTokens = useMemo(
    () => [token1, token2].filter((x): x is WhitelistedToken => !!x),
    [token1, token2],
  );

  const handleAmount1Change = useCallback(
    (newAmount?: BigNumber) => {
      setFieldTouched('amount1', true);
      setFieldValue('amount1', newAmount, true);
    },
    [setFieldValue, setFieldTouched],
  );
  const handleAmount2Change = useCallback(
    (newAmount?: BigNumber) => {
      setFieldTouched('amount2', true);
      setFieldValue('amount2', newAmount, true);
    },
    [setFieldValue, setFieldTouched],
  );

  const handleSomeTokenChange = useCallback(
    (
      fieldName: 'token1' | 'token2',
      amountFieldName: 'amount1' | 'amount2',
      newToken?: WhitelistedToken,
    ) => {
      const newTokenSlug = newToken && getTokenSlug(newToken);
      setFieldTouched(fieldName, true);
      const valuesToSet: Partial<SwapFormValues> = {
        [fieldName]: newToken,
      };
      const amount = amountFieldName === 'amount1' ? amount1 : amount2;
      if (newToken && amount) {
        setFieldTouched(amountFieldName, true);
        valuesToSet[amountFieldName] = amount.decimalPlaces(newToken.metadata.decimals);
      }
      setValues((prevValues) => ({ ...prevValues, ...valuesToSet }));
      if (newTokenSlug) {
        updateTokenBalance(newToken!);
      }
      const newToken1 = fieldName === 'token1' ? newToken : token1;
      const newToken2 = fieldName === 'token2' ? newToken : token2;
      if (newToken1 && newToken2) {
        onTokensSelected(newToken1, newToken2);
      }
    },
    [
      setValues,
      updateTokenBalance,
      setFieldTouched,
      amount1,
      amount2,
      token1,
      token2,
      onTokensSelected,
    ],
  );

  const handleToken1Change = useCallback(
    (newToken?: WhitelistedToken) => {
      handleSomeTokenChange('token1', 'amount1', newToken);
    },
    [handleSomeTokenChange],
  );
  const handleToken2Change = useCallback(
    (newToken?: WhitelistedToken) => handleSomeTokenChange('token2', 'amount2', newToken),
    [handleSomeTokenChange],
  );

  const handleSwapButtonClick = useCallback(() => {
    setValues(
      (prevState) => ({
        ...prevState,
        token1: token2,
        token2: token1,
        amount1: amount2,
      }),
    );
    if (token1 && token2) {
      onTokensSelected(token2, token1);
    }
  }, [setValues, token1, token2, amount2, onTokensSelected]);

  const handleRecipientChange = useCallback(
    (newValue: string) => {
      setFieldTouched('recipient', true);
      setFieldValue('recipient', newValue, true);
    },
    [setFieldValue, setFieldTouched],
  );

  const handleRecipientChangeFromEvent = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => handleRecipientChange(e.currentTarget.value),
    [handleRecipientChange],
  );

  const handleSlippageChange = useCallback(
    (newValue?: BigNumber) => {
      setFieldTouched('slippage', true);
      setFieldValue('slippage', newValue, true);
    },
    [setFieldValue, setFieldTouched],
  );

  const priceImpact = useMemo(
    () => (token1 && amount1 && dexRoute && slippage ? getPriceImpact({
      inputToken: token1,
      inputAmount: fromDecimals(amount1, -token1.metadata.decimals),
      dexChain: dexRoute,
      slippageTolerance: slippage?.div(100),
      ttDexAddress: TTDEX_CONTRACTS[network.id],
    }) : new BigNumber(0)),
    [amount1, network.id, slippage, token1, dexRoute],
  );

  const token1Slug = token1 && getTokenSlug(token1);
  const token2Slug = token2 && getTokenSlug(token2);
  const token2Balance = token2Slug === undefined ? undefined : knownTokensBalances[token2Slug];

  const token1Error = touched.token1 ? errors.token1 : undefined;
  const amount1Error = touched.amount1 ? errors.amount1 : undefined;
  const token2Error = touched.token2 ? errors.token2 : undefined;
  const amount2Error = touched.amount2 ? errors.amount2 : undefined;

  return (
    <>
      {token1 && token2 && (network.id === 'mainnet') && (
        <SwapChart
          token1={token1}
          token2={token2}
        />
      )}
      <StickyBlock className={className}>
        <Card
          header={{
            content: (
              <Tabs
                values={TabsContent}
                activeId={action!}
                setActiveId={handleTabSwitch}
                className={s.tabs}
              />
            ),
            button: (
              <Button theme="quaternary">
                <Transactions />
              </Button>
            ),
            className: s.header,
          }}
          contentClassName={s.content}
        >
          <NewTokenSelect
            showBalanceButtons={!!accountPkh}
            amount={amount1}
            className={s.input}
            balance={token1Slug === undefined ? undefined : knownTokensBalances[token1Slug]}
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
            outputAmount={amount2}
            onChange={handleSlippageChange}
            slippage={slippage}
            outputToken={token2}
          />
          <Button
            disabled={(Object.keys(errors).length > 0) || !accountPkh}
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
