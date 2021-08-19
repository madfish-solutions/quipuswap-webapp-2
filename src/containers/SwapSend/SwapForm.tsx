import React, {
  useMemo, useState, useEffect, useRef,
} from 'react';
import cx from 'classnames';
import { Field, FormSpy } from 'react-final-form';
import BigNumber from 'bignumber.js';

import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { SwapFormValues, WhitelistedToken } from '@utils/types';
import {
  useAccountPkh,
  useTezos,
  useNetwork,
} from '@utils/dapp';
import {
  composeValidators, isAddress, validateBalance, validateMinMax,
} from '@utils/validators';
import {
  getWhitelistedTokenSymbol,
  isTokenEqual,
  parseDecimals,
  slippageToBignum,
} from '@utils/helpers';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { ComplexRecipient } from '@components/ui/ComplexInput';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/Button';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';

import s from '@styles/CommonContainer.module.sass';
// import { estimateSwap } from '@quipuswap/sdk';
// import { FACTORIES } from '@utils/defaults';
import { SwapButton } from './SwapButton';
// import { tokenToAsset } from './swapHelpers';

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

  type QSMainNet = 'mainnet' | 'florencenet';

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
  const [, setVal] = useState(values);
  // const [formValues, setSubm] = useState<boolean>(false);
  const [, setSubm] = useState<boolean>(false);
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');

  useEffect(() => {
    form.mutators.setValue('balance1', undefined);
    form.mutators.setValue('balance2', undefined);
  }, [networkId]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: SwapFormValues) => {
    if (!tezos) return;
    if (token1 === undefined || token2 === undefined) return;
    const currentTokenA = tokenDataToToken(tokensData.first);
    const currentTokenB = tokenDataToToken(tokensData.second);
    const isTokensSame = isTokenEqual(currentTokenA, currentTokenB);
    const isValuesSame = val[lastChange] === values[lastChange];
    if (val[lastChange] && val[lastChange].toString() === '') return;
    if (isTokensSame || isValuesSame) return;
    if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
    const rate = (+tokensData.first.exchangeRate) / (+tokensData.second.exchangeRate);
    const retValue = lastChange === 'balance1' ? (val.balance1) * rate : (val.balance2) / rate;
    const decimals = lastChange === 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;

    // const fromAsset = tokenToAsset(tokensData.second);
    // const toAsset = tokenToAsset(tokensData.second);

    // const asyncUpdatePrice = async () => {
    //   try {
    //     const result = await estimateSwap(
    //       tezos,
    //       FACTORIES[networkId],
    //       fromAsset,
    //       toAsset,
    //       { inputValue: new BigNumber(lastChange === 'balance1' ? val.balance1 : val.balance2) },
    //     );
    //     form.mutators.setValue(
    //       lastChange === 'balance1' ? 'balance2' : 'balance1',
    //       parseDecimals(
    //         result.toString(),
    //         0,
    //         Infinity,
    //         decimals,
    //       ),
    //     );
    //   } catch (e) {
    //     console.error(e);
    //   }
    // };
    // asyncUpdatePrice();
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
  }, [values, tokensData, token1, token2]);

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
            error={((meta.touched && meta.error) || meta.submitError)}
          />
        )}
      </Field>
      <SwapButton onClick={() => {
        form.mutators.setValue(
          'balance1',
          values.balance2,
        );
        setLastChange(lastChange === 'balance1' ? 'balance2' : 'balance1');
        handleSwapTokens();
      }}
      />
      <Field
        parse={(v) => parseDecimals(v, 0, Infinity)}
        name="balance2"
      >
        {({ input }) => (
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
        type="submit"
        disabled={
          values.balance1 === undefined
          || values.balance1.toString() === ''
          || token2 === undefined
        }
        onClick={handleSwapSubmit}
        className={s.button}
      >
        {currentTab.label}
      </Button>
    </Card>
  );
};

export const SwapForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
