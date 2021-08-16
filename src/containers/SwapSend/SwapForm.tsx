import React, {
  useMemo, useState, useEffect, useRef, useCallback,
} from 'react';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { Field, FormSpy } from 'react-final-form';
import { TransferParams } from '@taquito/taquito';

import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { QSMainNet, WhitelistedToken } from '@utils/types';
import {
  useAccountPkh,
  useTezos,
  useNetwork,
} from '@utils/dapp';
import {
  composeValidators, isAddress, required, validateBalance, validateMinMax,
} from '@utils/validators';
import {
  getWhitelistedTokenSymbol,
  isTokenEqual,
  parseDecimals,
  slippageToBignum,
} from '@utils/helpers';
import { FACTORIES, FEE_RATE } from '@utils/defaults';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { ComplexRecipient } from '@components/ui/ComplexInput';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/Button';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { SwapIcon } from '@components/svg/Swap';

import s from '@styles/CommonContainer.module.sass';
import { swap } from '@quipuswap/sdk';
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

type TokenDataType = {
  token: {
    address: string,
    type: 'fa1.2' | 'fa2',
    id?: number | null
    decimals: number,
  },
  balance: string,
  exchangeRate?: string
};

type TokenDataMap = {
  first: TokenDataType,
  second: TokenDataType
};

export type SwapFormValues = {
  balance1: number
  balance2: number
  recipient: string
  lastChange: string
  slippage: string
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

const tokenDataToToken = (tokenData:TokenDataType) : WhitelistedToken => ({
  contractAddress: tokenData.token.address,
  fa2TokenId: tokenData.token.id,
} as WhitelistedToken);

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
  const { openConnectWalletModal } = useConnectModalsState();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const [fee, setFee] = useState<number>(0);
  const [estimatedOutputValue, setEstimatedOutputValue] = useState<string>('');
  const [swapParams, setSwapParams] = useState<TransferParams[]>([]);

  useEffect(() => {
    form.mutators.setValue('balance1', undefined);
    form.mutators.setValue('balance2', undefined);
  }, [networkId]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: SwapFormValues) => {
    const currentTokenA = tokenDataToToken(tokensData.first);
    const currentTokenB = tokenDataToToken(tokensData.second);
    const isTokensSame = isTokenEqual(currentTokenA, currentTokenB);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    if (isTokensSame || (isValuesSame) || token1 === undefined || token2 === undefined) return;
    if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
    const rate = (+tokensData.first.exchangeRate) / (+tokensData.second.exchangeRate);
    const retValue = lastChange === 'balance1' ? (val.balance1) * rate : (val.balance2) / rate;
    const decimals = lastChange === 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;

    setEstimatedOutputValue(parseDecimals(
      retValue.toString(),
      0,
      Infinity,
      decimals,
    ));

    form.mutators.setValue(
      lastChange === 'balance1' ? 'balance2' : 'balance1',
      parseDecimals(
        retValue.toString(),
        0,
        Infinity,
        decimals,
      ),
    );
  };

  const loadFee = useCallback(async () => {
    const retValue = new BigNumber(estimatedOutputValue).div(
      new BigNumber(10)
        .pow(
          new BigNumber(6),
        ),
    ).toString();
    if (retValue === 'NaN') return;
    setFee((+retValue) * (+FEE_RATE));
  }, [estimatedOutputValue]);

  const asyncGetSwapParams = async () => {
    if (!tezos) return;
    try {
      const fromAsset = tokensData.first.token.address === 'tez' ? 'tez' : {
        contract: tokensData.first.token.address,
        id: tokensData.first.token.id ?? undefined,
      };
      const toAsset = tokensData.second.token.address === 'tez' ? 'tez' : {
        contract: tokensData.second.token.address,
        id: tokensData.second.token.id ?? undefined,
      };
      const paramsValue = await swap(
        tezos,
        FACTORIES[networkId],
        fromAsset,
        toAsset,
        values.balance1 ? values.balance1 : 5,
        values.slippage,
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
    loadFee();
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [values, tezos, accountPkh, token1, token2]);

  const handleSwapSubmit = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal(); return;
    }
    handleSubmit();
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
            required,
            validateMinMax(0, Infinity),
            validateBalance(+tokensData.first.balance),
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
                    +parseDecimals(value, 0, Infinity, token1.metadata.decimals),
                  );
                }
              }}
              handleChange={(token) => handleTokenChange(token, 'first')}
              balance={tokensData.first.balance}
              exchangeRate={tokensData.first.exchangeRate}
              id="swap-send-from"
              label="From"
              className={s.input}
              error={((lastChange === 'balance1' && meta.touched && meta.error) || meta.submitError)}
            />
          )}
        </Field>
        <Button
          theme="quaternary"
          className={s.iconButton}
          onClick={() => {
            form.mutators.setValue(
              'balance1',
              values.balance2,
            );
            handleSwapTokens();
          }}
        >
          <SwapIcon />
        </Button>
        <Field
          parse={(v) => parseDecimals(v, 0, Infinity)}
          name="balance2"
        >
          {({ input, meta }) => (
            <TokenSelect
              {...input}
              blackListedTokens={blackListedTokens}
              onFocus={() => setLastChange('balance2')}
              token={token2}
              setToken={setToken2}
              handleBalance={(value) => {
                if (token2) {
                  form.mutators.setValue(
                    'balance2',
                    +parseDecimals(value, 0, Infinity, token2.metadata.decimals),
                  );
                }
              }}
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
        {currentTab.id === 'send' && (
        <Field
          validate={isAddress}
          name="recipient"
        >
          {({ input, meta }) => {
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
            />;
          }}
        </Field>
        )}
        <Field initialValue="0.5 %" name="slippage">
          {({ input }) => {
            const slippagePercent = (
              (
                (values.balance2 ?? 0) * (+slippageToBignum(values.slippage))
              ).toFixed(tokensData.second.token.decimals)).toString();
            const minimumReceived = (values.balance2 ?? 0) - (+slippagePercent);
            return (
              <>
                <Slippage handleChange={(value) => input.onChange(value)} />
                <div className={s.receive}>
                  <span className={s.receiveLabel}>
                    Minimum received:
                  </span>
                  <CurrencyAmount
                    amount={minimumReceived.toString()}
                    currency={token2 ? getWhitelistedTokenSymbol(token2) : ''}
                  />
                </div>
              </>
            );
          }}

        </Field>
        <Button type="submit" onClick={handleSwapSubmit} className={s.button}>
          {currentTab.label}
        </Button>
      </Card>
      <SwapDetails
        currentTab={currentTab.label}
        token1={token1}
        token2={token2}
        fee={fee.toString()}
        tokensData={tokensData}
        swapParams={swapParams}
      />
    </>
  );
};

export const SwapForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
