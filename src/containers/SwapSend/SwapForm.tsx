import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Tabs,
  Card,
  Button,
  Slippage,
  SwapButton,
  Transactions,
  CurrencyAmount,
} from '@quipuswap/ui-kit';
import { estimateSwap, FoundDex } from '@quipuswap/sdk';
import { Field, FormSpy } from 'react-final-form';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import {
  QSMainNet,
  SwapFormValues,
  TokenDataMap,
  WhitelistedToken,
} from '@utils/types';
import {
  useAccountPkh,
  useTezos,
  useNetwork,
} from '@utils/dapp';
import {
  isAddress,
  validateMinMax,
  validateBalance,
  composeValidators,
} from '@utils/validators';
import {
  toDecimals,
  isDexEqual,
  isTokenEqual,
  fromDecimals,
  parseDecimals,
  slippageToBignum,
  getWhitelistedTokenSymbol,
  transformTokenDataToAsset,
} from '@utils/helpers';
import { FACTORIES, FEE_RATE } from '@utils/defaults';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import useUpdateToast from '@hooks/useUpdateToast';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { ComplexRecipient } from '@components/ui/ComplexInput';

import s from '@styles/CommonContainer.module.sass';

import { SwapDetails } from './SwapDetails';
import { getDex } from './swapHelpers';

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

export type SwapSendProps = {
  className?: string
};

type SwapFormProps = {
  handleSubmit:() => void,
  debounce:number,
  save:any,
  values:SwapFormValues,
  form:any,
  tabsState:any,
  setTabsState: (state:string) => void,
  token1:WhitelistedToken,
  setToken1:(token:WhitelistedToken) => void,
  token2:WhitelistedToken,
  setToken2:(token:WhitelistedToken) => void,
  tokensData:TokenDataMap,
  handleSwapTokens:() => void,
  handleTokenChange:(token: WhitelistedToken, tokenNumber: 'first' | 'second') => void,
  currentTab:any
};

const RealForm:React.FC<SwapFormProps> = ({
  debounce,
  save,
  values,
  form,
  tabsState,
  setTabsState,
  token1,
  token2,
  setToken1,
  setToken2,
  tokensData,
  handleSwapTokens,
  handleTokenChange,
  currentTab,
  handleSubmit,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const updateToast = useUpdateToast();
  const {
    openConnectWalletModal,
    connectWalletModalOpen,
    closeConnectWalletModal,
  } = useConnectModalsState();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [fee, setFee] = useState<BigNumber>();
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const [priceImpact, setPriceImpact] = useState<BigNumber>(new BigNumber(0));
  const [rate1, setRate1] = useState<BigNumber>(new BigNumber(0));
  const [rate2, setRate2] = useState<BigNumber>(new BigNumber(0));
  const [[dex, dex2], setDex] = useState<FoundDex[]>([]);
  const [[oldDex, oldDex2], setOldDex] = useState<FoundDex[]>([]);
  const [[dexstorage, dexstorage2], setDexstorage] = useState<any>([]);
  const [[oldToken1, oldToken2], setOldTokens] = useState<WhitelistedToken[]>([token1, token2]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const handleInputChange = async (val: SwapFormValues) => {
    if (!tezos) return;
    if (Object.keys(val).length < 1) return;
    if (!val[lastChange] || val[lastChange].toString() === '.') {
      if (!val.balance1 && !val.balance2) return;
      form.mutators.setValue(
        'balance1', undefined,
      );
      form.mutators.setValue(
        'balance2', undefined,
      );
      return;
    }
    const isTokenToToken = token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez';
    if (!dex || !dexstorage || (isTokenToToken && !dex2)) return;
    if (token1 === undefined || token2 === undefined) return;
    let lastChangeMod = lastChange;
    const isTokensSame = isTokenEqual(token1, oldToken1)
      && isTokenEqual(token2, oldToken2);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    const isDex1Same = dex && oldDex && isDexEqual(dex, oldDex);
    const isDex2Same = dex2 && oldDex2 && isDexEqual(dex2, oldDex2);
    const isDexSame = isDex1Same || (isTokenToToken && isDex1Same && isDex2Same);
    if (isValuesSame && isTokensSame && isDexSame) return;
    if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
    if (isValuesSame && !isTokensSame) {
      lastChangeMod = 'balance1';
    }
    const decimals1 = lastChangeMod === 'balance1'
      ? token1.metadata.decimals
      : token2.metadata.decimals;
    const decimals2 = lastChangeMod !== 'balance1'
      ? token1.metadata.decimals
      : token2.metadata.decimals;

    const inputWrapper = new BigNumber(lastChangeMod === 'balance1' ? val.balance1 : val.balance2);
    const inputValueInner = toDecimals(inputWrapper, decimals1);
    const fromAsset = transformTokenDataToAsset(tokensData.first);
    const toAsset = transformTokenDataToAsset(tokensData.second);

    const valuesInner = lastChangeMod === 'balance1' ? { inputValue: inputValueInner } : { outputValue: inputValueInner };

    let retValue = new BigNumber(0);
    let feeType = 'single';
    try {
      if (isTokenToToken && dex2) {
        const sendDex = { inputDex: dex, outputDex: dex2 };
        feeType = 'double';
        retValue = await estimateSwap(
          tezos,
          FACTORIES[networkId],
          fromAsset,
          toAsset,
          valuesInner,
          sendDex,
        );
      } else {
        const sendDex = token2.contractAddress === 'tez' ? { outputDex: dex } : { inputDex: dex };
        retValue = await estimateSwap(
          tezos,
          FACTORIES[networkId],
          fromAsset,
          toAsset,
          valuesInner,
          sendDex,
        );
      }
      retValue = fromDecimals(retValue, decimals2);
    } catch (e) {
      handleErrorToast(e);
    }

    const result = new BigNumber(parseDecimals(
      retValue.toFixed(),
      0,
      Infinity,
      decimals2,
    ));

    const tokenToTokenRate = new BigNumber(tokensData.first.exchangeRate)
      .div(tokensData.second.exchangeRate);

    let rate1buf = new BigNumber(result)
      .div(val.balance2);
    if (lastChangeMod === 'balance1') {
      rate1buf = new BigNumber(val.balance1)
        .div(result);
    }

    const priceImp = new BigNumber(1)
      .minus(rate1buf.exponentiatedBy(-1).div(tokenToTokenRate))
      .multipliedBy(100);
    setRate1(rate1buf);
    setRate2(rate1buf.exponentiatedBy(-1));
    setPriceImpact(priceImp);

    form.mutators.setValue(
      lastChangeMod === 'balance1' ? 'balance2' : 'balance1', result,
    );

    setOldTokens([token1, token2]);
    setOldDex([dex, dex2]);
    let feeVal = result;
    if (feeType === 'double') { feeVal = result.multipliedBy(2); }
    setFee(feeVal.multipliedBy(new BigNumber(FEE_RATE)));
  };

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    handleInputChange(values);
    promise = save(values);
    await promise;
    setSubm(false);
  };

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(saveFunc, debounce);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
    // eslint-disable-next-line
  }, [
    token1,
    token2,
    values,
    tokensData,
    tezos,
    accountPkh,
    dex,
    dex2,
    dexstorage,
  ]);

  useEffect(() => {
    form.mutators.setValue('recipient', accountPkh);
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
    // eslint-disable-next-line
  }, [accountPkh, closeConnectWalletModal]);

  useEffect(() => {
    form.mutators.setValue('balance1', undefined);
    form.mutators.setValue('balance2', undefined);
    // eslint-disable-next-line
  }, [networkId]);

  const handleSwapSubmit = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal(); return;
    }
    handleSubmit();
  };

  useEffect(() => {
    if (!tezos || !token2 || !token1) return;
    const asyncFunc = async () => {
      const { dexes, storages } = await getDex({
        tezos,
        networkId,
        token1,
        token2,
      });
      setDex(dexes);
      setDexstorage(storages);
    };
    asyncFunc();
  }, [token2, token1, tezos, networkId]);

  const handleSwapButton = useCallback(() => {
    handleSwapTokens();
    if (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez') {
      setDex([dex2, dex]);
      setDexstorage([dexstorage2, dexstorage]);
    }
    if (lastChange === 'balance1') {
      setLastChange('balance2');
    } else {
      setLastChange('balance1');
    }
    if (values.balance1 && values.balance2) {
      form.mutators.setValues(
        ['balance1', new BigNumber(values.balance2)],
        ['balance2', new BigNumber(values.balance1)],
      );
    }
    // eslint-disable-next-line
  }, [token1, token2, dex, dex2, lastChange, values, form, dexstorage, dexstorage2]);

  const blackListedTokens = useMemo(
    () => [...(token1 ? [token1] : []), ...(token2 ? [token2] : [])],
    [token1, token2],
  );

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => setTabsState(val)}
              className={s.tabs}
            />
          ),
          button: (
            <Button
              theme="quaternary"
            >
              <Transactions />
            </Button>
          ),
          className: s.header,
        }}
        contentClassName={s.content}
      >
        <Field
          validate={composeValidators(
            validateMinMax(0, Infinity),
            accountPkh ? validateBalance(new BigNumber(tokensData.first.balance)) : () => undefined,
          )}
          parse={(v) => token1?.metadata && parseDecimals(v, 0, Infinity, token1.metadata.decimals)}
          name="balance1"
        >
          {({ input, meta }) => (
            <TokenSelect
              {...input}
              blackListedTokens={blackListedTokens}
              onFocus={() => setLastChange('balance1')}
              token={token1}
              setToken={setToken1}
              handleBalance={(value) => {
                if (token1) {
                  form.mutators.setValue(
                    'balance1',
                    new BigNumber(parseDecimals(value, 0, Infinity, token1.metadata.decimals)),
                  );
                }
              }}
              noBalanceButtons={!accountPkh}
              handleChange={(token) => {
                handleTokenChange(token, 'first');
                setDex([]);
              }}
              balance={tokensData.first.balance}
              exchangeRate={tokensData.first.exchangeRate}
              id="swap-send-from"
              label="From"
              className={s.input}
              error={((meta.error) || meta.submitError)}
            />
          )}
        </Field>
        <SwapButton onClick={handleSwapButton} />
        <Field
          parse={(v) => token2?.metadata && parseDecimals(v, 0, Infinity, token2.metadata.decimals)}
          name="balance2"
        >
          {({ input, meta }) => (
            <TokenSelect
              {...input}
              blackListedTokens={blackListedTokens}
              onFocus={() => setLastChange('balance2')}
              token={token2}
              setToken={setToken2}
              handleBalance={() => {}}
              noBalanceButtons
              handleChange={(token) => {
                handleTokenChange(token, 'second');
                setDex([]);
              }}
              balance={tokensData.second.balance}
              exchangeRate={tokensData.second.exchangeRate}
              id="swap-send-to"
              label="To"
              className={cx(s.input, s.mb24)}
              error={((lastChange === 'balance2' && meta.touched && meta.error) || meta.submitError)}
            />
          )}
        </Field>
        <Field
          validate={currentTab.id === 'send' ? isAddress : () => undefined}
          name="recipient"
        >
          {({ input, meta }) => (
            <>
              {currentTab.id === 'send' && (
              <ComplexRecipient
                {...input}
                handleInput={(value) => {
                  form.mutators.setValue(
                    'recipient',
                    value,
                  );
                }}
                label="Recipient address"
                id="swap-send-recipient"
                className={cx(s.input, s.mb24)}
                error={((meta.touched && meta.error) || meta.submitError)}
              />
              )}
            </>
          )}
        </Field>
        <Field initialValue="0.5 %" name="slippage">
          {({ input }) => {
            const slipPerc = slippageToBignum(values.slippage).multipliedBy(values.balance2 ?? 0);
            const minimumReceived = new BigNumber(values.balance2 ?? 0).minus(slipPerc);
            return (
              <>
                <Slippage handleChange={(value) => input.onChange(value)} />
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
          }}

        </Field>
        <Button
          disabled={
          values.balance1 === undefined
          || values.balance1.toString() === ''
          || token2 === undefined
        }
          type="submit"
          onClick={handleSwapSubmit}
          className={s.button}
        >
          {currentTab.label}
        </Button>
      </Card>
      <SwapDetails
        dex={dex}
        dex2={dex2}
        currentTab={currentTab.label}
        token1={token1}
        token2={token2}
        fee={(fee ?? 0).toString()}
        tokensData={tokensData}
        priceImpact={priceImpact}
        rate1={rate1}
        rate2={rate2}
      />
    </>
  );
};

export const SwapForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
