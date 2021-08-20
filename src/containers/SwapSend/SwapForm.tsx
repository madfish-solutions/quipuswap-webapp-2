import React, {
  useMemo, useState, useEffect, useRef,
} from 'react';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import {
  Asset,
  estimateTezToToken,
  estimateTezToTokenInverse,
  estimateTokenToTez,
  estimateTokenToTezInverse,
  findDex,
  FoundDex,
  isTezAsset,
  isTokenAsset,
  swap,
} from '@quipuswap/sdk';
import { Field, FormSpy } from 'react-final-form';
import { TransferParams } from '@taquito/taquito';

import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  QSMainNet, SwapFormValues, TokenDataMap, TokenDataType, WhitelistedToken,
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

import s from '@styles/CommonContainer.module.sass';
import { SwapButton } from './SwapButton';
import { SwapDetails } from './SwapDetails';
import { isTez, toNat } from './swapHelpers';

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

export async function estimateSwap(
  fromAsset: Asset,
  toAsset: Asset,
  values: { inputValue: BigNumber.Value } | { outputValue: BigNumber.Value },
  dex:FoundDex,
  dex2:FoundDex,
  lastChange: string,
) {
  if (isTezAsset(fromAsset) && isTokenAsset(toAsset)) {
    return 'outputValue' in values
      ? estimateTezToTokenInverse(dex.storage, values.outputValue)
      : estimateTezToToken(dex.storage, values.inputValue);
  } if (isTokenAsset(fromAsset) && isTezAsset(toAsset)) {
    return 'outputValue' in values
      ? estimateTokenToTezInverse(dex.storage, values.outputValue)
      : estimateTokenToTez(dex.storage, values.inputValue);
  } if (isTokenAsset(fromAsset) && isTokenAsset(toAsset)) {
    if ('outputValue' in values) {
      const intermediateTezValue = estimateTezToTokenInverse(
        dex.storage,
        values.outputValue,
      );
      return estimateTokenToTezInverse(dex2.storage, intermediateTezValue);
    }
    const intermediateTezValue = estimateTokenToTez(
      dex2.storage,
      values.inputValue,
    );
    return estimateTezToToken(dex.storage, intermediateTezValue);
  }
  throw new Error('Unsupported exchange way');
}

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
  const [fee, setFee] = useState<BigNumber>();
  const [swapParams, setSwapParams] = useState<TransferParams[]>([]);
  const [oldToken1, setOldToken1] = useState<WhitelistedToken>();
  const [oldToken2, setOldToken2] = useState<WhitelistedToken>();
  const [priceImpact, setPriceImpact] = useState<BigNumber>(new BigNumber(0));
  const [rate1, setRate1] = useState<BigNumber>(new BigNumber(0));
  const [rate2, setRate2] = useState<BigNumber>(new BigNumber(0));
  const [dex, setDex] = useState<FoundDex>();
  const [dex2, setDex2] = useState<FoundDex>();
  const [dexstorage, setDexstorage] = useState<any>();
  const [, setDexstorage2] = useState<any>();

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: SwapFormValues) => {
    if (!tezos) return;
    if (!dex || !dexstorage || (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez' && !dex2)) return;
    if (token1 === undefined || token2 === undefined) return;
    if (val[lastChange] && val[lastChange].toString() === '') return;

    const currentTokenA = tokenDataToToken(tokensData.first);
    const currentTokenB = tokenDataToToken(tokensData.second);
    const isTokensSame = isTokenEqual(currentTokenA, currentTokenB);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    const oldTokens = token1 === oldToken1 && token2 === oldToken2;
    if (isTokensSame || (isValuesSame && oldTokens)) return;
    if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
    const decimals1 = lastChange === 'balance1'
      ? tokensData.first.token.decimals
      : tokensData.second.token.decimals;
    const decimals2 = lastChange !== 'balance1'
      ? tokensData.first.token.decimals
      : tokensData.second.token.decimals;

    const inputWrapper = lastChange === 'balance1' ? val.balance1 : val.balance2;
    const inputValueInner = new BigNumber(+inputWrapper * (10 ** decimals1)).integerValue();

    const fromAsset = tokensData.first.token.address === 'tez' ? 'tez' : {
      contract: tokensData.first.token.address,
      id: tokensData.first.token.id ?? undefined,
    };
    const toAsset = tokensData.second.token.address === 'tez' ? 'tez' : {
      contract: tokensData.second.token.address,
      id: tokensData.second.token.id ?? undefined,
    };

    const valuesInner = lastChange === 'balance1' ? { inputValue: inputValueInner } : { outputValue: inputValueInner };

    let retValue = new BigNumber(0);
    try {
      retValue = await estimateSwap(fromAsset, toAsset, valuesInner, dex, dex2, lastChange);
      retValue = retValue.div(
        new BigNumber(10)
          .pow(
            new BigNumber(decimals2),
          ),
      );
    } catch (e) {
      console.error(e);
    }

    const result = parseDecimals(
      retValue.toFixed(),
      0,
      Infinity,
      decimals2,
    );

    if (lastChange === 'balance1') {
      const rate1buf = new BigNumber(val.balance1)
        .div(result);
      const priceImp = rate1buf
        .div(+tokensData.second.exchangeRate / +tokensData.first.exchangeRate)
        .multipliedBy(100).minus(100);
      setRate1(rate1buf);
      setRate2(rate1buf.exponentiatedBy(-1));
      setPriceImpact(priceImp);
    } else {
      const rate2buf = new BigNumber(val.balance2)
        .div(result);
      const priceImp = rate2buf
        .div(+tokensData.first.exchangeRate / +tokensData.second.exchangeRate)
        .multipliedBy(100).minus(100);
      setRate1(rate2buf.exponentiatedBy(-1));
      setRate2(rate2buf);
      setPriceImpact(priceImp);
    }

    form.mutators.setValue(
      lastChange === 'balance1' ? 'balance2' : 'balance1', result,
    );
    const feeVal = new BigNumber(result).div(
      new BigNumber(10)
        .pow(
          new BigNumber(6),
        ),
    );
    setFee(feeVal.multipliedBy(new BigNumber(FEE_RATE)));
    setOldToken1(token1);
    setOldToken2(token2);
  };

  const asyncGetSwapParams = async () => {
    if (!tezos || !values.balance1) return;
    try {
      const fromAsset = token1.contractAddress === 'tez' ? 'tez' : {
        contract: token1.contractAddress,
        id: token1.fa2TokenId ?? undefined,
      };
      const toAsset = token2.contractAddress === 'tez' ? 'tez' : {
        contract: token2.contractAddress,
        id: token2.fa2TokenId ?? undefined,
      };
      const inputValue = isTez(tokensData.first)
        ? tezos!!.format('tz', 'mutez', values.balance1) as any
        : toNat(values.balance1, tokensData.first.token.decimals);
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
  }, [values, tokensData, tezos, accountPkh, token1, token2, dex, dexstorage]);

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

      const dexbuf1 = await findDex(tezos, FACTORIES[networkId], token2.contractAddress === 'tez' ? fromAsset : toAsset);
      const dexStorageBuf1:any = await dexbuf1.contract.storage();
      setDex(dexbuf1);
      setDexstorage(dexStorageBuf1);
      if (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez') {
        const dexbuf2 = await findDex(tezos, FACTORIES[networkId], fromAsset);
        const dexStorageBuf2:any = await dexbuf2.contract.storage();
        setDex2(dexbuf2);
        setDexstorage2(dexStorageBuf2);
      }
    };
    getDex();
  }, [token2, token1, tezos, networkId]);

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
        <SwapButton onClick={() => {
          form.mutators.setValue(
            'balance1',
            values.balance2,
          );
          handleSwapTokens();
        }}
        />
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
                    new BigNumber(parseDecimals(value, 0, Infinity, token2.metadata.decimals)),
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
        currentTab={currentTab.label}
        token1={token1}
        token2={token2}
        fee={(fee ?? 0).toString()}
        tokensData={tokensData}
        swapParams={swapParams}
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
