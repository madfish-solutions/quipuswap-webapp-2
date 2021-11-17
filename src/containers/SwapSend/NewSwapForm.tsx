import BigNumber from 'bignumber.js';
import cx from 'classnames';
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
  CurrencyAmount,
} from '@quipuswap/ui-kit';

import { ComplexRecipient } from '@components/ui/ComplexInput';
import { NewTokenSelect } from '@components/ui/ComplexInput/NewTokenSelect';
import { Transactions } from '@components/svg/Transactions';
import { useDexGraph } from '@hooks/useDexGraph';
import { useNewExchangeRates } from '@hooks/useNewExchangeRate';
import {
  useAccountPkh,
  useNetwork,
  useTezos,
} from '@utils/dapp';
import { TTDEX_CONTRACTS } from '@utils/defaults';
import {
  convertUnits,
  DexGraph,
  estimateSwapFee,
  getPriceImpact,
  getRouteWithInput,
  getRouteWithOutput,
  getTokenInput,
  getTokenOutput,
  getTokenSlug,
  getWhitelistedTokenSymbol,
  slippageToBignum,
} from '@utils/helpers';
import {
  DexPair,
  NewSwapFormValues,
  QSMainNet,
  WhitelistedToken,
} from '@utils/types';

import s from '@styles/CommonContainer.module.sass';

import { SwapChart } from './SwapChart';
import { NewSwapDetails } from './NewSwapDetails';

type NewSwapFormProps = FormikProps<Partial<NewSwapFormValues>> & {
  className?: string;
  submitError?: string;
  updateTokenBalance: (token: WhitelistedToken) => void;
  knownTokensBalances: Record<string, BigNumber>;
};

type SlippageInputProps = {
  onChange: (newValue: string) => void;
  value: string;
  balance2?: BigNumber;
  token2?: WhitelistedToken;
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
  balance2,
  onChange,
  value,
  token2,
}) => {
  const slipPerc = slippageToBignum(value)
    .times(balance2 ?? 0)
    .decimalPlaces(token2?.metadata.decimals ?? 0, BigNumber.ROUND_DOWN);
  const minimumReceived = new BigNumber(balance2 ?? 0).minus(slipPerc);

  return (
    <>
      <Slippage handleChange={onChange} />
      <div className={s.receive}>
        <span className={s.receiveLabel}>
          Minimum received:
        </span>
        <CurrencyAmount
          amount={minimumReceived.isNaN() ? '0' : minimumReceived.toString()}
          currency={token2 ? getWhitelistedTokenSymbol(token2) : ''}
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

export const NewSwapForm: React.FC<NewSwapFormProps> = ({
  className,
  errors,
  submitForm,
  setValues,
  setFieldValue,
  submitError,
  values: {
    token1,
    token2,
    amount1,
    amount2,
    recipient,
    slippage,
    action,
  },
  knownTokensBalances,
  updateTokenBalance,
}) => {
  const exchangeRates = useNewExchangeRates();
  const network = useNetwork();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { label: currentTabLabel } = TabsContent.find(({ id }) => id === action)!;

  const { dexGraph, updateTokenToXtzDexGraphPart } = useDexGraph();
  const [fee, setFee] = useState<BigNumber>();
  const [dexRoute, setDexRoute] = useState<DexPair[]>();
  const prevToken1Ref = useRef<WhitelistedToken>();
  const prevToken2Ref = useRef<WhitelistedToken>();
  const prevAmount1Ref = useRef<BigNumber>();
  const prevAmount2Ref = useRef<BigNumber>();
  const prevDexGraphRef = useRef<DexGraph>();
  const prevAccountPkh = useRef<string | null>(null);

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

  useEffect(() => {
    const prevToken1 = prevToken1Ref.current;
    const prevToken2 = prevToken2Ref.current;
    const prevAmount1 = prevAmount1Ref.current;
    const prevAmount2 = prevAmount2Ref.current;
    const prevToken1Slug = prevToken1 && getTokenSlug(prevToken1);
    const prevToken2Slug = prevToken2 && getTokenSlug(prevToken2);
    const token1Slug = token1 && getTokenSlug(token1);
    const token2Slug = token2 && getTokenSlug(token2);

    if (
      ((prevToken1Slug !== token1Slug) || !amountsAreEqual(prevAmount1, amount1))
      && token1 && token1.contractAddress !== 'tez'
    ) {
      updateTokenToXtzDexGraphPart(token1);
    }
    if (
      ((prevToken2Slug !== token2Slug) || !amountsAreEqual(prevAmount2, amount2))
      && token2 && token2.contractAddress !== 'tez'
    ) {
      updateTokenToXtzDexGraphPart(token2);
    }
  }, [amount1, amount2, token1, token2, updateTokenToXtzDexGraphPart]);

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
          inputAmount: convertUnits(amount1, -token1.metadata.decimals),
        });
        let outputAmount: BigNumber | undefined;
        if (route) {
          try {
            outputAmount = convertUnits(
              getTokenOutput({
                inputToken: token1,
                inputAmount: convertUnits(amount1!, -token1.metadata.decimals),
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
          estimateSwapFee(
            tezos!,
            accountPkh,
            {
              inputToken: token1,
              inputAmount: convertUnits(amount1, -token1.metadata.decimals),
              dexChain: route,
              recipient,
            },
          )
            .then((newFee) => setFee(convertUnits(newFee, 6)))
            .catch((e) => {
              console.error(e);
              setFee(undefined);
            });
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
            inputAmount = convertUnits(
              getTokenInput(
                token2,
                convertUnits(amount2!, -token2.metadata.decimals),
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
          estimateSwapFee(
            tezos!,
            accountPkh,
            {
              inputToken: token1,
              inputAmount: convertUnits(inputAmount, -token1.metadata.decimals),
              dexChain: route,
              recipient,
            },
          )
            .then((newFee) => setFee(convertUnits(newFee, 6)))
            .catch((e) => {
              console.error(e);
              setFee(undefined);
            });
        } else {
          setFee(undefined);
        }
      }
    }
  }, [amount1, amount2, token1, token2, dexGraph, setFieldValue, accountPkh, tezos, recipient]);

  const handleSubmit = useCallback(() => {
    submitForm().then(
      () => setValues((prevValues) => ({ ...prevValues, amount1: undefined, amount2: undefined })),
    ).catch(console.error);
  }, [setValues, submitForm]);

  const handleTabSwitch = useCallback(
    (newTabId: string) => {
      const valuesToSet: Partial<NewSwapFormValues> = {
        action: newTabId as NewSwapFormValues['action'],
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
    (newAmount?: BigNumber) => setFieldValue('amount1', newAmount, true),
    [setFieldValue],
  );
  const handleAmount2Change = useCallback(
    (newAmount?: BigNumber) => setFieldValue('amount2', newAmount, true),
    [setFieldValue],
  );

  const handleSomeTokenChange = useCallback(
    (fieldName: string, newToken?: WhitelistedToken) => {
      const newTokenSlug = newToken && getTokenSlug(newToken);
      setFieldValue(fieldName, newToken, true);
      if (newTokenSlug) {
        updateTokenBalance(newToken!);
      } else {
        setFieldValue(fieldName, undefined, true);
      }
    },
    [setFieldValue, updateTokenBalance],
  );

  const handleToken1Change = useCallback(
    (newToken?: WhitelistedToken) => handleSomeTokenChange('token1', newToken),
    [handleSomeTokenChange],
  );
  const handleToken2Change = useCallback(
    (newToken?: WhitelistedToken) => handleSomeTokenChange('token2', newToken),
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
  }, [setValues, token1, token2, amount2]);

  const handleRecipientChange = useCallback(
    (newValue: string) => setFieldValue('recipient', newValue, true),
    [setFieldValue],
  );

  const handleRecipientChangeFromEvent = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => handleRecipientChange(e.currentTarget.value),
    [handleRecipientChange],
  );

  const handleSlippageChange = useCallback(
    (newValue: string) => setFieldValue('slippage', newValue, true),
    [setFieldValue],
  );

  const priceImpact = useMemo(
    () => (token1 && amount1 && dexRoute && slippage ? getPriceImpact({
      inputToken: token1,
      inputAmount: convertUnits(amount1, -token1.metadata.decimals),
      dexChain: dexRoute,
      slippageTolerance: slippageToBignum(slippage),
      ttDexAddress: TTDEX_CONTRACTS[network.id as QSMainNet],
    }) : new BigNumber(0)),
    [amount1, network.id, slippage, token1, dexRoute],
  );

  const token1Slug = token1 && getTokenSlug(token1);
  const token2Slug = token2 && getTokenSlug(token2);
  const token2Balance = token2Slug === undefined ? undefined : knownTokensBalances[token2Slug];

  return (
    <>
      {token1 && token2 && (
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
            error={errors.token1 ?? errors.amount1}
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
            error={errors.token2 ?? errors.amount2 ?? submitError}
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
              error={errors.recipient}
            />
          )}
          <SlippageInput
            balance2={amount2}
            onChange={handleSlippageChange}
            value={slippage ?? ''}
            token2={token2}
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
          <NewSwapDetails
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
