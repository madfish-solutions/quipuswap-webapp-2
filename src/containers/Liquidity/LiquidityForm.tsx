import React, {
  useEffect, useMemo, useRef, useState,
  useCallback,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { Field, FormSpy } from 'react-final-form';
import {
  addLiquidity,
  estimateSharesInTez,
  estimateSharesInToken,
  estimateTezInShares,
  estimateTokenInShares,
  FoundDex,
  swap,
  TransferParams,
} from '@quipuswap/sdk';

import {
  useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { usePrevious } from '@hooks/usePrevious';
import {
  TokenDataMap, TokenDataType,
  WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';

import {
  composeValidators, required, validateBalance, validateMinMax,
} from '@utils/validators';
import {
  getWhitelistedTokenSymbol, isTokenEqual, parseDecimals, slippageToBignum, slippageToNum,
} from '@utils/helpers';
import { Tooltip } from '@components/ui/Tooltip';
import { FACTORIES } from '@utils/defaults';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { Switcher } from '@components/ui/Switcher';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { ComplexInput } from '@components/ui/ComplexInput';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { ArrowDown } from '@components/svg/ArrowDown';
import { Plus } from '@components/svg/Plus';

import s from '@styles/CommonContainer.module.sass';

import { asyncGetLiquidityShare, hanldeTokenPairSelect } from './liquidityHelpers';
import { LiquidityDetails } from './LiquidityDetails';

const TabsContent = [
  {
    id: 'add',
    label: 'Add',
  },
  {
    id: 'remove',
    label: 'Remove',
  },
];

export type LiquidityFormValues = {
  switcher: boolean
  balance1: number
  balance2: number
  balance3: number
  balanceA: number
  balanceB: number
  balanceTotalA: number
  balanceTotalB: number
  lpBalance: string
  frozenBalance: string
  lastChange: string
  estimateLP: string
  slippage: string
};

type LiquidityFormProps = {
  handleSubmit: () => void,
  setAddLiquidityParams: (params:TransferParams[]) => void,
  setRemoveLiquidityParams: (params:TransferParams[]) => void,
  addLiquidityParams:TransferParams[],
  removeLiquidityParams:TransferParams[],
  debounce:number,
  save:any,
  values:LiquidityFormValues,
  form:any,
  tabsState:any,
  dex: FoundDex,
  setDex: (dex:FoundDex) => void,
  tokenPair: WhitelistedTokenPair,
  setTokenPair: (pair:WhitelistedTokenPair) => void,
  tokensData:TokenDataMap,
  handleTokenChange:(token: WhitelistedToken, tokenNumber: 'first' | 'second') => void,
  currentTab:any,
  setTabsState:(val:any) => void
};

const tokenDataToToken = (tokenData:TokenDataType) : WhitelistedToken => ({
  contractAddress: tokenData.token.address,
  fa2TokenId: tokenData.token.id ?? undefined,
} as WhitelistedToken);

const toNat = (amount: any, decimals: number) => new BigNumber(amount)
  .times(10 ** decimals)
  .integerValue(BigNumber.ROUND_DOWN);

const isTez = (tokensData:TokenDataType) => tokensData.token.address === 'tez';

    type QSMainNet = 'mainnet' | 'florencenet';

const RealForm:React.FC<LiquidityFormProps> = ({
  handleSubmit,
  debounce,
  save,
  values,
  form,
  tabsState,
  dex,
  setDex,
  tokenPair,
  setTokenPair,
  tokensData,
  handleTokenChange,
  currentTab,
  setTabsState,
  setAddLiquidityParams,
  setRemoveLiquidityParams,
  removeLiquidityParams,
}) => {
  const { openConnectWalletModal } = useConnectModalsState();
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([]);
  const accountPkh = useAccountPkh();
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const prevDex = usePrevious(dex);
  const [,setPoolShare] = useState<any>();

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: LiquidityFormValues) => {
    const currentTokenA = tokenDataToToken(tokensData.first);
    const currentTokenB = tokenDataToToken(tokensData.second);
    const isTokensSame = isTokenEqual(currentTokenA, currentTokenB);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    const isRemValuesSame = val.balance3 === formValues.balance3;
    const isDexSame = dex === prevDex;
    if (tezos && accountPkh && token1 && token2) {
      if (isTokensSame || ((currentTab.id === 'remove' ? isRemValuesSame : isValuesSame) && isDexSame)) return;
      asyncGetLiquidityShare(
        setDex,
        setTokenPair,
        form.mutators.setValue,
        setPoolShare,
        setRemoveLiquidityParams,
        setAddLiquidityParams,
        values,
        token1,
        token2,
        tokenPair,
        currentTab.id === 'remove' ? tokenPair.dex : dex,
        currentTab,
        tezos,
        accountPkh,
        networkId,
      );
    }
    if (tezos) {
      if (currentTab.id === 'remove') {
        if (val.balance3 === formValues.balance3 || !tokenPair.dex) return;
        try {
          const getMethod = async (
            token:WhitelistedToken,
            foundDex:FoundDex,
            value:BigNumber,
          ) => (token.contractAddress === 'tez'
            ? estimateTezInShares(foundDex.storage, value.toString())
            : estimateTokenInShares(foundDex.storage, value.toString()));
          // const balance = new BigNumber(values.balance3 * (10 ** decimals1));
          const balance = new BigNumber(
            values.balance3 * (10 ** 6), // ONLY WORKS FOR XTZ LPs!
          );
          const sharesA = await getMethod(
            tokenPair.token1,
            tokenPair.dex,
            balance.integerValue(),
          );
          const sharesB = await getMethod(
            tokenPair.token2,
            tokenPair.dex,
            balance.integerValue(),
          );
          const bal1 = sharesA.div(
            new BigNumber(10)
              .pow(
                new BigNumber(6),
              ),
          ).toString();
          const bal2 = sharesB.div(
            new BigNumber(10)
              .pow(
                new BigNumber(tokenPair.token2.metadata.decimals),
              ),
          ).toString();

          form.mutators.setValue(
            'balanceA',
            +bal1,
          );

          form.mutators.setValue(
            'balanceB',
            +bal2,
          );
        } catch (err) {
          console.error(err);
        }
      } else if (!val.switcher) {
        if (isTokensSame || (isValuesSame)) return;
        if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
        const rate = (+tokensData.first.exchangeRate) / (+tokensData.second.exchangeRate);
        const retValue = lastChange === 'balance1' ? (val.balance1) * rate : (val.balance2) / rate;
        const decimals = lastChange === 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;

        form.mutators.setValue(
          lastChange === 'balance1' ? 'balance2' : 'balance1',
          parseDecimals(
            retValue.toString(),
            0,
            Infinity,
            decimals,
          ),
        );
        if (!dex) return;
        try {
          try {
            const getInputValue = (token:TokenDataType, balance:string) => (isTez(token)
              ? tezos!!.format('tz', 'mutez', balance) as any
              : toNat(balance, token.token.decimals));

            const getMethod = async (
              token:TokenDataType,
              foundDex:FoundDex,
              value:BigNumber,
            ) => (isTez(token)
              ? estimateSharesInTez(foundDex.storage, getInputValue(token, value.toString()))
              : estimateSharesInToken(foundDex.storage, getInputValue(token, value.toString())));
            const sharesA = await getMethod(
              tokensData.first,
              dex,
              new BigNumber(values.balance1),
            );
            const sharesB = await getMethod(
              tokensData.second,
              dex,
              lastChange === 'balance2' ? new BigNumber(values.balance2) : new BigNumber(retValue),
            );

            const lp1 = sharesA.div(
              new BigNumber(10)
                .pow(
                  new BigNumber(tokensData.first.token.decimals),
                ),
            ).toString();
            const lp2 = sharesB.div(
              new BigNumber(10)
                .pow(
                  new BigNumber(tokensData.second.token.decimals),
                ),
            ).toString();

            form.mutators.setValue(
              'estimateLP',
              lp1 + lp2,
            );
          } catch (e) {
            console.error(e);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const exA = +(tokensData.first.exchangeRate ?? '1');
        const exB = +(tokensData.second.exchangeRate ?? '1');
        const total$ = (
          (values.balance1 * exA)
              + (values.balance2 * exB)
        ) / 2;
        const $toA = total$ / exA;
        const $toB = total$ / exB;
        let inputValue:BigNumber;
        if (values.balance1 - $toA < values.balance2 - $toB) {
          inputValue = isTez(tokensData.first)
            ? tezos!!.format('tz', 'mutez', values.balance2 - $toB) as any
            : toNat(values.balance2 - $toB, tokensData.first.token.decimals);
        } else {
          inputValue = isTez(tokensData.first)
            ? tezos!!.format('tz', 'mutez', values.balance1 - $toA) as any
            : toNat(values.balance1 - $toA, tokensData.first.token.decimals);
        }
        const fromAsset = isTez(tokensData.first) ? 'tez' : {
          contract: tokensData.first.token.address,
          id: tokensData.first.token.id ?? undefined,
        };
        const toAsset = isTez(tokensData.second) ? 'tez' : {
          contract: tokensData.second.token.address,
          id: tokensData.second.token.id ?? undefined,
        };
        const slippage = slippageToNum(values.slippage) / 100;
        const swapParams = await swap(
          tezos,
          FACTORIES[networkId],
          fromAsset,
          toAsset,
          inputValue,
          slippage,
        );
        const addParams = await addLiquidity(
          tezos,
          dex,
          { tezValue: $toA, tokenValue: $toB },
        );
        setAddLiquidityParams([...swapParams, ...addParams]);
      }
    }
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
  }, [
    values.balance1,
    values.balance2,
    values.balance3,
    values.slippage,
    token1,
    token2,
    tokenPair,
    dex,
    currentTab]);

  const handleAddLiquidity = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal(); return;
    }
    handleSubmit();
  };

  const handleRemoveLiquidity = async () => {
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

  const tokenAName = useMemo(() => (token1 ? getWhitelistedTokenSymbol(token1) : 'Token A'), [token1]);
  const tokenBName = useMemo(() => (token2 ? getWhitelistedTokenSymbol(token2) : 'Token B'), [token2]);

  const setToken1 = useCallback((token:WhitelistedToken) => {
    setTokens([token, (token2 || undefined)]);
    if (token2) {
      hanldeTokenPairSelect(
        { token1: token, token2 } as WhitelistedTokenPair,
        setTokenPair,
        handleTokenChange,
        tezos,
        accountPkh,
        networkId,
      );
    }
  }, [tezos, accountPkh, networkId, token2]);
  const setToken2 = useCallback((token:WhitelistedToken) => {
    setTokens([(token1 || undefined), token]);
    if (token1) {
      hanldeTokenPairSelect(
        { token1, token2: token } as WhitelistedTokenPair,
        setTokenPair,
        handleTokenChange,
        tezos,
        accountPkh,
        networkId,
      );
    }
  }, [tezos, accountPkh, networkId, token1]);

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
        {currentTab.id === 'remove' && (
        <Field
          name="balance3"
          validate={composeValidators(
            required,
            validateMinMax(0, Infinity),
            validateBalance(tokenPair.balance ? +tokenPair.balance : Infinity),
          )}
        >
          {({ input, meta }) => (
            <>
              <PositionSelect
                {...input}
                tokenPair={tokenPair}
                setTokenPair={(pair) => {
                  setTokens([pair.token1, pair.token2]);
                  handleTokenChange(pair.token1, 'first');
                  handleTokenChange(pair.token2, 'second');
                  hanldeTokenPairSelect(
                    pair,
                    setTokenPair,
                    handleTokenChange,
                    tezos,
                    accountPkh,
                    networkId,
                  );
                }}
                handleBalance={(value) => {
                  form.mutators.setValue(
                    'balance3',
                    +value,
                  );
                }}
                balance={tokenPair.balance}
                frozenBalance={tokenPair.frozenBalance}
                id="liquidity-remove-input"
                label="Select LP"
                className={s.input}
                error={((meta.touched && meta.error) || meta.submitError)}
              />
              <ArrowDown className={s.iconButton} />
            </>
          )}
        </Field>
        )}
        {currentTab.id === 'remove' && (
        <Field
          name="balanceA"
        >
          {({ input }) => (
            <ComplexInput
              {...input}
              token1={tokenPair.token1}
              handleBalance={() => {}}
              balance={tokensData.first.balance}
              exchangeRate={tokensData.first.exchangeRate}
              id="liquidity-token-1"
              label="Output"
              className={cx(s.input, s.mb24)}
              readOnly
            />

          )}
        </Field>
        )}

        {currentTab.id !== 'remove' && (
        <Field
          name="balance1"
          validate={composeValidators(
            required,
            validateMinMax(0, Infinity),
            validateBalance(tokensData.first.balance ? +tokensData.first.balance : Infinity),
          )}
          parse={(v) => parseDecimals(v, 0, Infinity)}
        >
          {({ input, meta }) => (
            <TokenSelect
              {...input}
              blackListedTokens={blackListedTokens}
              onFocus={() => setLastChange('balance1')}
              token={token1}
              setToken={setToken1}
              handleBalance={(value) => {
                setLastChange('balance1');
                form.mutators.setValue(
                  'balance1',
                  +parseDecimals(
                    value,
                    0,
                    Infinity,
                    token1 ? token1.metadata.decimals : undefined,
                  ),
                );
              }}
              handleChange={(token) => handleTokenChange(token, 'first')}
              balance={tokensData.first.balance}
              exchangeRate={tokensData.first.exchangeRate}
              id="liquidity-token-1"
              label="Input"
              className={s.input}
              error={((meta.touched && meta.error) || meta.submitError)}
            />
          )}

        </Field>
        )}
        <Plus className={s.iconButton} />
        {currentTab.id === 'remove' && (
        <Field
          name="balanceB"
        >
          {({ input }) => (
            <ComplexInput
              {...input}
              token1={tokenPair.token2}
              handleBalance={() => {}}
              balance={tokensData.second.balance}
              exchangeRate={tokensData.second.exchangeRate}
              id="liquidity-token-2"
              label="Output"
              className={cx(s.input, s.mb24)}
              readOnly
            />
          )}
        </Field>
        )}
        {currentTab.id !== 'remove' && (
        <Field
          name="balance2"
          validate={composeValidators(
            required,
            validateMinMax(0, Infinity),
            validateBalance(tokensData.second.balance ? +tokensData.second.balance : Infinity),
          )}
          parse={(v) => parseDecimals(v, 0, Infinity)}
        >
          {({ input, meta }) => (
            <TokenSelect
              {...input}
              blackListedTokens={blackListedTokens}
              onFocus={() => setLastChange('balance2')}
              token={token2}
              setToken={setToken2}
              handleBalance={(value) => {
                setLastChange('balance2');
                form.mutators.setValue(
                  'balance2',
                  +parseDecimals(
                    value,
                    0,
                    Infinity,
                    token2 ? token2.metadata.decimals : undefined,
                  ),
                );
              }}
              handleChange={(token) => handleTokenChange(token, 'second')}
              balance={tokensData.second.balance}
              exchangeRate={tokensData.second.exchangeRate}
              id="liquidity-token-2"
              label="Input"
              className={cx(s.input, s.mb24)}
              error={((meta.touched && meta.error) || meta.submitError)}
            />
          )}
        </Field>
        )}

        <Field initialValue="0.5 %" name="slippage">
          {({ input }) => {
            const slippagePercent = (
              (
                (values.balance2 ?? 0) * (+slippageToBignum(values.slippage))
              ).toFixed(tokensData.second.token.decimals)).toString();
            const minimumReceivedA = (values.balanceA ?? 0) - (+slippagePercent);
            const minimumReceivedB = (values.balanceB ?? 0) - (+slippagePercent);
            const maxInvestedA = (values.balance1 ?? 0) - (+slippagePercent);
            const maxInvestedB = (values.balance2 ?? 0) - (+slippagePercent);
            return (
              <>
                <Slippage handleChange={(value) => input.onChange(value)} />
                {currentTab.id === 'add' && (
                <>
                  {!values.switcher ? (
                    <div className={cx(s.receive, s.mb24)}>
                      <span className={s.receiveLabel}>
                        Max invested:
                      </span>
                      <CurrencyAmount
                        currency={`${tokenAName}/${tokenBName}`}
                        amount={values.estimateLP}
                      />
                    </div>
                  )
                    : (
                      <>
                        <div className={s.receive}>
                          <span className={s.receiveLabel}>
                            Max invested:
                          </span>
                          <CurrencyAmount
                            currency={tokenAName}
                            amount={maxInvestedA.toString()}
                          />
                        </div>
                        <div className={cx(s.receive, s.mb24)}>
                          <span className={s.receiveLabel}>
                            Max invested:
                          </span>
                          <CurrencyAmount
                            currency={tokenBName}
                            amount={maxInvestedB.toString()}
                          />
                        </div>
                      </>
                    )}
                </>
                )}

                {currentTab.id === 'remove' && (
                <>
                  <div className={s.receive}>
                    <span className={s.receiveLabel}>
                      Minimum received:
                    </span>
                    <CurrencyAmount
                      currency={tokenAName}
                      amount={minimumReceivedA < 0 ? '0' : minimumReceivedA.toString()}
                    />
                  </div>
                  <div className={s.receive}>
                    <span className={s.receiveLabel}>
                      Minimum received:
                    </span>
                    <CurrencyAmount
                      currency={tokenBName}
                      amount={minimumReceivedB < 0 ? '0' : minimumReceivedB.toString()}
                    />
                  </div>
                  <Button onClick={handleRemoveLiquidity} className={s.button}>
                    Remove & Unvote
                  </Button>
                </>
                )}
              </>
            );
          }}

        </Field>
        {currentTab.id === 'add' && (
        <>
          <Field name="switcher">
            {({ input }) => (

              <div className={s.switcher}>
                <Switcher
                  {...input}
                  isActive={input.value}
                  className={s.switcherInput}
                  disabled={!dex}
                />
                Rebalance Liquidity
                <Tooltip content="Token prices in a pool may change significantly within seconds. Slippage tolerance defines the difference between the expected and current exchange rate that you find acceptable. The higher the slippage tolerance, the more likely a transaction will go through." />
              </div>
            )}
          </Field>
          <Button onClick={handleAddLiquidity} className={s.button}>
            {currentTab.label}
          </Button>
        </>
        )}

      </Card>
      <LiquidityDetails
        currentTab={currentTab.label}
        params={removeLiquidityParams}
        token1={token1}
        token2={token2}
        tokensData={tokensData}
        tokenPair={tokenPair}
        balanceTotalA={(values.balanceTotalA ?? 0).toString()}
        balanceTotalB={(values.balanceTotalB ?? 0).toString()}
      />
    </>
  );
};

export const LiquidityForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
