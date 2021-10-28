import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { estimateSwap, FoundDex } from '@quipuswap/sdk';
import { Field, FormSpy } from 'react-final-form';

import { useConnectModalsState } from '@hooks/useConnectModalsState';
import useUpdateToast from '@hooks/useUpdateToast';
import { useLoadDex } from '@hooks/useLoadDex';
import { QSMainNet, SwapFormValues, TokenDataMap, WhitelistedToken } from '@utils/types';
import { useAccountPkh, useTezos, useNetwork } from '@utils/dapp';
import { composeValidators, isAddress, validateBalance, validateMinMax } from '@utils/validators';
import {
  fromDecimals,
  getWhitelistedTokenDecimals,
  isDexEqual,
  isTokenEqual,
  parseDecimals,
  toDecimals,
  transformTokenDataToAsset,
} from '@utils/helpers';
import { FACTORIES, FEE_RATE, TEZOS_TOKEN } from '@utils/defaults';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { ComplexRecipient } from '@components/ui/ComplexInput';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/Button';
import { SwapButton } from '@components/common/SwapButton';
// import { Transactions } from '@components/svg/Transactions';

import s from '@styles/CommonContainer.module.sass';
import { SwapDetails } from '../SwapDetails';
import { SwapFormSlippage } from './SwapFormSlippage';

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
  className?: string;
};

type SwapFormProps = {
  handleSubmit: () => void;
  debounce: number;
  save: any;
  values: SwapFormValues;
  form: any;
  tabsState: any;
  setTabsState: (state: string) => void;
  token1: WhitelistedToken;
  setToken1: (token: WhitelistedToken) => void;
  token2: WhitelistedToken;
  setToken2: (token: WhitelistedToken) => void;
  tokensData: TokenDataMap;
  handleSwapTokens: () => void;
  handleTokenChange: (arg: any) => void;
  currentTab: any;
};

const RealForm: React.FC<SwapFormProps> = ({
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
  const { openConnectWalletModal, connectWalletModalOpen, closeConnectWalletModal } =
    useConnectModalsState();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const [priceImpact, setPriceImpact] = useState<BigNumber>(new BigNumber(0));
  const [rate1, setRate1] = useState<BigNumber>(new BigNumber(0));
  const [rate2, setRate2] = useState<BigNumber>(new BigNumber(0));
  const {
    dexes: [dex1, dex2],
    storages: [dexStorage1, dexStorage2],
    setDex,
    setDexStorage,
  } = useLoadDex({ token1, token2 });
  const [[oldDex1, oldDex2], setOldDex] = useState<FoundDex[]>([]);
  const [[oldToken1, oldToken2], setOldTokens] = useState<WhitelistedToken[]>([token1, token2]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise: any;

  const handleErrorToast = useCallback(
    (err) => {
      updateToast({
        type: 'error',
        render: `${err.name}: ${err.message}`,
      });
    },
    [updateToast],
  );

  const handleInputChange = async (val: SwapFormValues) => {
    if (!tezos) return;
    if (Object.keys(val).length < 1) return;
    if (!val[lastChange] || val[lastChange].toString() === '.') {
      if (!val.balance1 && !val.balance2) return;
      form.mutators.setValue('balance1', undefined);
      form.mutators.setValue('balance2', undefined);
      return;
    }
    const balance1 = new BigNumber(val.balance1 ?? 0);
    const balance2 = new BigNumber(val.balance2 ?? 0);
    const isTokenToToken = token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez';
    if (!dex1 || !dexStorage1 || (isTokenToToken && !dex2)) return;
    if (token1 === undefined || token2 === undefined) return;
    if (isTokenEqual(token1, token2)) return;
    let lastChangeMod = lastChange;
    const isTokensSame = isTokenEqual(token1, oldToken1) && isTokenEqual(token2, oldToken2);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    const isDex1Same = dex1 && oldDex1 && isDexEqual(dex1, oldDex1);
    const isDex2Same = dex2 && oldDex2 && isDexEqual(dex2, oldDex2);
    const isDexSame = isDex1Same || (isTokenToToken && isDex1Same && isDex2Same);
    if (isValuesSame && isTokensSame && isDexSame) return;
    if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) {
      return;
    }
    if (isValuesSame && !isTokensSame) {
      lastChangeMod = 'balance1';
    }
    const decimals1 =
      lastChangeMod === 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;
    const decimals2 =
      lastChangeMod !== 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;

    const inputWrapper = new BigNumber(
      lastChangeMod === 'balance1'
        ? parseDecimals(balance1.toFixed(), 0, Infinity, token1.metadata.decimals)
        : parseDecimals(balance2.toFixed(), 0, Infinity, token2.metadata.decimals),
    );
    const inputValueInner = toDecimals(inputWrapper, decimals1);
    const fromAsset = transformTokenDataToAsset(tokensData.first);
    const toAsset = transformTokenDataToAsset(tokensData.second);

    const valuesInner =
      lastChangeMod === 'balance1'
        ? { inputValue: inputValueInner }
        : { outputValue: inputValueInner };

    let retValue = new BigNumber(0);
    if (!inputWrapper.eq(0)) {
      try {
        if (isTokenToToken && dex2) {
          const sendDex = { inputDex: dex1, outputDex: dex2 };
          retValue = await estimateSwap(
            tezos,
            FACTORIES[networkId],
            fromAsset,
            toAsset,
            valuesInner,
            sendDex,
          );
        } else {
          const sendDex =
            token2.contractAddress === 'tez' ? { outputDex: dex1 } : { inputDex: dex1 };
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
    }

    const result = new BigNumber(parseDecimals(retValue.toFixed(), 0, Infinity, decimals2));

    const tokenToTokenRate = new BigNumber(tokensData.first.exchangeRate).div(
      tokensData.second.exchangeRate,
    );

    let rate1buf = new BigNumber(result).div(balance1);
    if (lastChangeMod === 'balance1') {
      rate1buf = balance1.div(result);
    }

    const priceImp = new BigNumber(1)
      .minus(rate1buf.exponentiatedBy(-1).div(tokenToTokenRate))
      .multipliedBy(100);
    setRate1(rate1buf);
    setRate2(rate1buf.exponentiatedBy(-1));
    setPriceImpact(priceImp);

    form.mutators.setValue(
      lastChangeMod === 'balance1' ? 'balance2' : 'balance1',
      result.toFixed(),
    );

    setOldTokens([token1, token2]);
    setOldDex([dex1, dex2]);
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
  }, [token1, token2, values, tokensData, tezos, accountPkh, dex1, dex2, dexStorage1]);

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
      openConnectWalletModal();
      return;
    }
    handleSubmit();
  };

  const handleSwapButton = useCallback(() => {
    handleSwapTokens();
    if (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez') {
      setDex([dex2, dex1]);
      setDexStorage([dexStorage2, dexStorage1]);
    }
    if (lastChange === 'balance1') {
      setLastChange('balance2');
    } else {
      setLastChange('balance1');
    }
    if (values.balance1 && values.balance2) {
      form.mutators.setValues(['balance1', values.balance2], ['balance2', values.balance1]);
    }
    // eslint-disable-next-line
  }, [token1, token2, dex1, dex2, lastChange, values, form, dexStorage1, dexStorage2]);

  const blackListedTokens = useMemo(
    () => [...(token1 ? [token1] : []), ...(token2 ? [token2] : [])],
    [token1, token2],
  );
  const fee = useMemo(() => {
    let feeVal = new BigNumber(values.balance1) ?? new BigNumber(0);
    if (
      token1.contractAddress !== TEZOS_TOKEN.contractAddress &&
      token2.contractAddress !== TEZOS_TOKEN.contractAddress
    ) {
      feeVal = feeVal.times(2);
    }
    return parseDecimals(
      feeVal.times(FEE_RATE).toFixed(),
      0,
      Infinity,
      getWhitelistedTokenDecimals(TEZOS_TOKEN),
    );
  }, [token1.contractAddress, token2.contractAddress, values.balance1]);

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
          // TODO: wait untill implemented API
          // button: (
          //   <Button
          //     theme="quaternary"
          //   >
          //     <Transactions />
          //   </Button>
          // ),
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
                handleTokenChange({ token, tokenNumber: 'first' });
                setDex([]);
              }}
              balance={tokensData.first.balance}
              exchangeRate={tokensData.first.exchangeRate}
              id="swap-send-from"
              label="From"
              className={s.input}
              error={meta.error || meta.submitError}
            />
          )}
        </Field>
        <SwapButton onClick={handleSwapButton} />
        <Field
          parse={(v) => token2?.metadata && parseDecimals(v, 0, Infinity, token2.metadata.decimals)}
          validate={validateMinMax(0, Infinity)}
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
                handleTokenChange({ token, tokenNumber: 'second' });
                setDex([]);
              }}
              balance={tokensData.second.balance}
              exchangeRate={tokensData.second.exchangeRate}
              id="swap-send-to"
              label="To"
              className={cx(s.input, s.mb24)}
              error={(meta.touched && meta.error) || meta.submitError}
            />
          )}
        </Field>
        <Field validate={currentTab.id === 'send' ? isAddress : () => undefined} name="recipient">
          {({ input, meta }) => (
            <>
              {currentTab.id === 'send' && (
                <ComplexRecipient
                  {...input}
                  handleInput={(value) => {
                    form.mutators.setValue('recipient', value);
                  }}
                  label="Recipient address"
                  id="swap-send-recipient"
                  className={cx(s.input, s.mb24)}
                  error={(meta.touched && meta.error) || meta.submitError}
                />
              )}
            </>
          )}
        </Field>
        <SwapFormSlippage values={values} token2={token2} />
        <Button
          disabled={values.balance1 === undefined || values.balance1 === '' || token2 === undefined}
          type="submit"
          onClick={handleSwapSubmit}
          className={s.button}
        >
          {currentTab.label}
        </Button>
      </Card>
      <SwapDetails
        dex1={dex1}
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

export const SwapForm = (props: any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
