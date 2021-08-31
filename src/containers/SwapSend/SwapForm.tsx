import React, {
  useMemo, useState, useEffect, useRef,
} from 'react';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import {
  estimateSwap,
  findDex,
  FoundDex,
  swap,
} from '@quipuswap/sdk';
import { Field, FormSpy } from 'react-final-form';
import { TransferParams } from '@taquito/taquito';

import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  QSMainNet, SwapFormValues, TokenDataMap, WhitelistedToken,
} from '@utils/types';
import {
  useAccountPkh,
  useTezos,
  useNetwork,
} from '@utils/dapp';
import {
  composeValidators, isAddress, validateBalance, validateMinMax,
} from '@utils/validators';
import {
  fromDecimals,
  getValueForSDK,
  getWhitelistedTokenSymbol,
  parseDecimals,
  slippageToBignum,
  toDecimals,
  transformTokenDataToAsset,
  transformWhitelistedTokenToAsset,
} from '@utils/helpers';
import { FACTORIES, FEE_RATE } from '@utils/defaults';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { ComplexRecipient } from '@components/ui/ComplexInput';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/Button';
import { SwapButton } from '@components/common/SwapButton';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';

import s from '@styles/CommonContainer.module.sass';
import { SwapDetails } from './SwapDetails';

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
  const {
    openConnectWalletModal,
    connectWalletModalOpen,
    closeConnectWalletModal,
  } = useConnectModalsState();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [fee, setFee] = useState<BigNumber>();
  const [, setSwapParams] = useState<TransferParams[]>([]);
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const [priceImpact, setPriceImpact] = useState<BigNumber>(new BigNumber(0));
  const [rate1, setRate1] = useState<BigNumber>(new BigNumber(0));
  const [rate2, setRate2] = useState<BigNumber>(new BigNumber(0));
  const [[dex, dex2], setDex] = useState<FoundDex[]>([]);
  const [[dexstorage, dexstorage2], setDexstorage] = useState<any>([]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: SwapFormValues) => {
    if (!tezos) return;
    if (Object.keys(val).length < 1) return;
    if (!val[lastChange]) {
      form.mutators.setValue(
        'balance1', undefined,
      );
      form.mutators.setValue(
        'balance2', undefined,
      );
      return;
    }
    if (!dex || !dexstorage || (tokensData.first.token.address !== 'tez' && tokensData.second.token.address !== 'tez' && !dex2)) return;
    if (token1 === undefined || token2 === undefined) return;
    if (val[lastChange] && val[lastChange].toString() === '') return;
    const lastChangeMod = lastChange;
    const isValuesSame = val[lastChange] === formValues[lastChange];
    if (isValuesSame) return;
    if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
    const decimals1 = lastChangeMod === 'balance1'
      ? tokensData.first.token.decimals
      : tokensData.second.token.decimals;
    const decimals2 = lastChangeMod !== 'balance1'
      ? tokensData.first.token.decimals
      : tokensData.second.token.decimals;

    const inputWrapper = new BigNumber(lastChangeMod === 'balance1' ? val.balance1 : val.balance2);
    const inputValueInner = toDecimals(inputWrapper, decimals1);
    const fromAsset = transformTokenDataToAsset(tokensData.first);
    const toAsset = transformTokenDataToAsset(tokensData.second);

    const valuesInner = lastChangeMod === 'balance1' ? { inputValue: inputValueInner } : { outputValue: inputValueInner };

    let retValue = new BigNumber(0);
    try {
      if (tokensData.first.token.address !== 'tez' && tokensData.second.token.address !== 'tez' && dex2) {
        const sendDex = { inputDex: dex, outputDex: dex2 };
        retValue = await estimateSwap(
          tezos,
          FACTORIES[networkId],
          fromAsset,
          toAsset,
          valuesInner,
          sendDex,
        );
      } else {
        const sendDex = tokensData.second.token.address === 'tez' ? { outputDex: dex } : { inputDex: dex };
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
      console.error(e);
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

    const feeVal = fromDecimals(result, 6);
    setFee(feeVal.multipliedBy(new BigNumber(FEE_RATE)));
  };

  const asyncGetSwapParams = async () => {
    if (!tezos || !values.balance1) return;
    try {
      const fromAsset = transformWhitelistedTokenToAsset(token1);
      const toAsset = transformWhitelistedTokenToAsset(token2);
      const inputValue = getValueForSDK(tokensData.first, new BigNumber(values.balance1), tezos);
      const paramsValue = await swap(
        tezos,
        FACTORIES[networkId],
        fromAsset,
        toAsset,
        inputValue,
      );
      setSwapParams(paramsValue);
    } catch (e) {
      console.error(e);
    }
  };

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    handleInputChange(values);
    if (tezos && accountPkh && token1 && token2) { asyncGetSwapParams(); }
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
  }, [
    values,
    tokensData,
    tezos,
    accountPkh,
    dex,
    dex2,
    dexstorage,
  ]);

  useEffect(() => {
    const localSaveFunc = async () => {
      if (!tezos) return;
      if (Object.keys(values).length < 1) return;
      if (!values[lastChange]) {
        return;
      }

      if (!dex || !dexstorage || (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez' && !dex2)) return;
      if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
      const decimals1 = token1.metadata.decimals;
      const decimals2 = token2.metadata.decimals;

      let retValue = new BigNumber(0);
      try {
        const inputWrapper = new BigNumber(values.balance1);
        const inputValueInner = toDecimals(inputWrapper, decimals1);

        const fromAsset = transformWhitelistedTokenToAsset(token1);
        const toAsset = transformWhitelistedTokenToAsset(token2);

        const valuesInner = { inputValue: inputValueInner };

        if (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez' && dex2) {
          const sendDex = { inputDex: dex, outputDex: dex2 };
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
        console.error(e);
      }

      const result = new BigNumber(parseDecimals(
        retValue.toFixed(),
        0,
        Infinity,
        decimals2,
      ));

      const rate1buf = new BigNumber(values.balance1)
        .div(result);
      const tokenToTokenRate = new BigNumber(tokensData.first.exchangeRate)
        .div(tokensData.second.exchangeRate);
      const priceImp = new BigNumber(1)
        .minus(rate1buf.exponentiatedBy(-1).div(tokenToTokenRate))
        .multipliedBy(100);
      setRate1(rate1buf);
      setRate2(rate1buf.exponentiatedBy(-1));
      setPriceImpact(priceImp);

      form.mutators.setValue(
        'balance2', result,
      );

      const feeVal = fromDecimals(result, 6);
      setFee(feeVal.multipliedBy(new BigNumber(FEE_RATE)));

      if (tezos && accountPkh && token1 && token2) { asyncGetSwapParams(); }
      promise = save(values);
    };
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(localSaveFunc, debounce);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [
    token1,
    token2,
    tezos,
    accountPkh,
    dex,
    dex2,
    dexstorage]);

  useEffect(() => {
    form.mutators.setValue('recipient', accountPkh);
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
  }, [accountPkh]);

  useEffect(() => {
    form.mutators.setValue('balance1', undefined);
    form.mutators.setValue('balance2', undefined);
  }, [networkId]);

  const handleSwapSubmit = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal(); return;
    }
    handleSubmit();
  };

  useEffect(() => {
    const getDex = async () => {
      if (!tezos || !token2 || !token1) return;
      const fromAsset = {
        contract: token1.contractAddress,
        id: token1.fa2TokenId ?? undefined,
      };
      const toAsset = {
        contract: token2.contractAddress,
        id: token2.fa2TokenId ?? undefined,
      };

      if (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez') {
        const dexbuf1 = await findDex(tezos, FACTORIES[networkId], fromAsset);
        const dexStorageBuf1:any = await dexbuf1.contract.storage();
        const dexbuf2 = await findDex(tezos, FACTORIES[networkId], toAsset);
        const dexStorageBuf2:any = await dexbuf2.contract.storage();
        setDex([dexbuf1, dexbuf2]);
        setDexstorage([dexStorageBuf1, dexStorageBuf2]);
      } else {
        const dexbuf = await findDex(tezos, FACTORIES[networkId], token2.contractAddress === 'tez' ? fromAsset : toAsset);
        const dexStorageBuf:any = await dexbuf.contract.storage();
        setDex([dexbuf]);
        setDexstorage([dexStorageBuf, undefined]);
      }
    };
    getDex();
  }, [token2, token1, tezos, networkId]);

  const handleSwapButton = () => {
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
  };

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
              handleChange={(token) => handleTokenChange(token, 'first')}
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
              handleChange={(token) => handleTokenChange(token, 'second')}
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
        values={values}
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
