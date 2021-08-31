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
  findDex,
  FoundDex,
  getLiquidityShare,
  swap,
  TransferParams,
} from '@quipuswap/sdk';

import {
  useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
// import { usePrevious } from '@hooks/usePrevious';
import {
  LiquidityFormValues,
  PoolShare,
  TokenDataMap, TokenDataType,
  WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';

import {
  composeValidators, validateBalance, validateMinMax,
} from '@utils/validators';
import {
  fromDecimals,
  getValueForSDK,
  getWhitelistedTokenSymbol, isTokenEqual, parseDecimals, slippageToBignum, toDecimals,
} from '@utils/helpers';
import { Tooltip } from '@components/ui/Tooltip';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
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

import router from 'next/router';
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
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  setTokens: (tokens:WhitelistedToken[]) => void,
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
  token1,
  token2,
  setTokens,
  tokenPair,
  setTokenPair,
  setTabsState,
  tokensData,
  handleTokenChange,
  currentTab,
  setAddLiquidityParams,
  addLiquidityParams,
  setRemoveLiquidityParams,
  removeLiquidityParams,
}) => {
  const { openConnectWalletModal } = useConnectModalsState();
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [dex, setDex] = useState<FoundDex>();
  const accountPkh = useAccountPkh();
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  // const prevDex = usePrevious(dex);
  const [poolShare, setPoolShare] = useState<PoolShare>();

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: LiquidityFormValues) => {
    const currentTokenA = tokenDataToToken(tokensData.first);
    if (currentTokenA.contractAddress !== TEZOS_TOKEN.contractAddress) return;
    const currentTokenB = tokenDataToToken(tokensData.second);
    const isTokensSame = isTokenEqual(currentTokenA, currentTokenB);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    const isRemValuesSame = val.balance3 === formValues.balance3;
    if (!dex) return;
    if (val.switcher !== formValues.switcher) setAddLiquidityParams([]);
    if (tezos && accountPkh && token1 && token2) {
      if (isTokensSame || ((currentTab.id === 'remove' ? isRemValuesSame : isValuesSame))) return;
      try {
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
      } catch (e) {
        console.error(e);
      }
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
          const balance = toDecimals(new BigNumber(values.balance3), 6);
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
          const bal1 = fromDecimals(sharesA, tokenPair.token1.metadata.decimals);
          const bal2 = fromDecimals(sharesB, tokenPair.token2.metadata.decimals);

          form.mutators.setValue('balanceA', bal1);
          form.mutators.setValue('balanceB', bal2);
        } catch (err) {
          console.error(err);
        }
      } else if (!val.switcher) {
        if (isTokensSame || (isValuesSame)) return;
        if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
        const rate = new BigNumber(tokensData.first.exchangeRate)
          .dividedBy(new BigNumber(tokensData.second.exchangeRate));
        const retValue = lastChange === 'balance1' ? new BigNumber(val.balance1).multipliedBy(rate) : new BigNumber(val.balance2).dividedBy(rate);
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
              lastChange === 'balance2' ? new BigNumber(values.balance2) : retValue,
            );

            const lp1 = fromDecimals(sharesA, tokensData.first.token.decimals);
            const lp2 = fromDecimals(sharesB, tokensData.second.token.decimals);

            form.mutators.setValue(
              'estimateLP',
              lp1.plus(lp2),
            );
          } catch (e) {
            console.error(e);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
        const bal1 = new BigNumber(values.balance1);
        const bal2 = new BigNumber(values.balance2);
        const exA = new BigNumber(tokensData.first.exchangeRate ?? '1');
        const exB = new BigNumber(tokensData.second.exchangeRate ?? '1');
        const initialAto$ = bal1.multipliedBy(exA);
        const initialBto$ = bal2.multipliedBy(exB);
        const total$ = initialAto$
          .plus(initialBto$)
          .div(2); // Total amount of Tokens pool in USD
        const $toA = total$.div(exA); // represents Token A in equal portion (50-50) in USD
        let inputValue:BigNumber;
        const val1 = initialAto$.minus(total$);
        const val2 = initialBto$.minus(total$);
        const whichTokenPoolIsGreater = val1
          .gt(val2);
        if (whichTokenPoolIsGreater) {
          inputValue = getValueForSDK(
            tokensData.first,
            val1.div(exA),
            tezos,
          );
        } else {
          inputValue = getValueForSDK(
            tokensData.second,
            val2.div(exB),
            tezos,
          );
        }
        const fromAsset = 'tez';
        const toAsset = {
          contract: tokensData.second.token.address,
          id: tokensData.second.token.id ?? undefined,
        };
        const slippage = slippageToBignum(values.slippage).div(100);
        try {
          const swapParams = await swap(
            tezos,
            FACTORIES[networkId],
            fromAsset,
            toAsset,
            inputValue,
            slippage,
          );
          const tezValue = toDecimals($toA, 6);
          const addParams = await addLiquidity(
            tezos,
            dex,
            { tezValue: tezValue.minus(tezValue.multipliedBy(slippage)) },
          );
          const params = [...swapParams, ...addParams];
          setAddLiquidityParams(params);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    setPoolShare(undefined);
    form.mutators.setValue(
      'balanceTotalA',
      0,
    );

    form.mutators.setValue(
      'balanceTotalB',
      0,
    );
    const getDex = async () => {
      if (!tezos || !token2 || !token1) return;
      const toAsset = {
        contract: token2.contractAddress,
        id: token2.fa2TokenId ?? undefined,
      };
      const dexbuf = await findDex(tezos, FACTORIES[networkId], toAsset);
      setDex(dexbuf);
      try {
        const getMethod = async (
          token:WhitelistedToken,
          foundDex:FoundDex,
          value:BigNumber,
        ) => (token.contractAddress === 'tez'
          ? estimateTezInShares(foundDex.storage, value.toString())
          : estimateTokenInShares(foundDex.storage, value.toString()));

        if (!accountPkh) return;
        const share = await getLiquidityShare(tezos, dexbuf, accountPkh);
        setPoolShare(share);
        const balanceAB = share.total;
        const sharesTotalA = await getMethod(
          token1,
          dexbuf,
          balanceAB.integerValue(),
        );
        const sharesTotalB = await getMethod(
          token2,
          dexbuf,
          balanceAB.integerValue(),
        );
        const balA1 = fromDecimals(sharesTotalA, 6).toString();
        const balA2 = fromDecimals(sharesTotalB, 6).toString();
        form.mutators.setValue(
          'balanceTotalA',
          balA1,
        );

        form.mutators.setValue(
          'balanceTotalB',
          balA2,
        );
      } catch (err) {
        console.error(err);
      }
    };
    getDex();
  }, [token2, token1, tezos, networkId, accountPkh]);

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

  useEffect(() => {
    const localSaveFunc = async () => {
      if (promise) {
        await promise;
      }
      setVal(values);
      setSubm(true);
      if (values.switcher !== formValues.switcher) {
        if (!values.switcher) {
          if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
          const rate = new BigNumber(tokensData.first.exchangeRate)
            .dividedBy(new BigNumber(tokensData.second.exchangeRate));
          const retValue = lastChange === 'balance1' ? new BigNumber(values.balance1).multipliedBy(rate) : new BigNumber(values.balance2).dividedBy(rate);
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
                lastChange === 'balance2' ? new BigNumber(values.balance2) : retValue,
              );

              const lp1 = fromDecimals(sharesA, tokensData.first.token.decimals);
              const lp2 = fromDecimals(sharesB, tokensData.second.token.decimals);

              form.mutators.setValue(
                'estimateLP',
                lp1.plus(lp2),
              );
            } catch (e) {
              console.error(e);
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
      promise = save(values);
      await promise;
      setSubm(false);
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
  }, [values.switcher]);

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
              setActiveId={(val) => {
                router.replace(
                  `/liquidity/${val}/${getWhitelistedTokenSymbol(token1)}-${getWhitelistedTokenSymbol(token2)}`,
                  undefined,
                  { shallow: true },
                );
                setTabsState(val);
              }}
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
              validateMinMax(0, Infinity),
              validateBalance(new BigNumber(tokenPair.balance ? tokenPair.balance : Infinity)),
            )}
            parse={(v) => parseDecimals(v, 0, Infinity, 6)}
          >
            {({ input, meta }) => (
              <>
                <PositionSelect
                  {...input}
                  notSelectable1={TEZOS_TOKEN}
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
                  balance={
                    new BigNumber(tokenPair.balance ?? '0')
                      .minus(new BigNumber(tokenPair.frozenBalance ?? '0'))
                      .toString()
                  }
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
              id="liquidity-token-A"
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
            validateMinMax(0, Infinity),
            accountPkh ? validateBalance(new BigNumber(tokensData.first.balance)) : () => undefined,
          )}
          parse={(v) => token1?.metadata && parseDecimals(v, 0, Infinity, token1.metadata.decimals)}
        >
          {({ input, meta }) => (
            <TokenSelect
              {...input}
              blackListedTokens={blackListedTokens}
              onFocus={() => setLastChange('balance1')}
              token={token1}
              setToken={() => {}}
              notSelectable
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
              error={((meta.error) || meta.submitError)}
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
              id="liquidity-token-B"
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
            validateMinMax(0, Infinity),
            accountPkh
              ? validateBalance(new BigNumber(tokensData.second.balance))
              : () => undefined,
          )}
          parse={(v) => token2?.metadata && parseDecimals(v, 0, Infinity, token2.metadata.decimals)}
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
              error={((meta.error) || meta.submitError)}
            />
          )}
        </Field>
        )}
        <Field initialValue="0.5 %" name="slippage">
          {({ input }) => {
            const slipPerc = slippageToBignum(values.slippage)
              .multipliedBy(new BigNumber(values.estimateLP ?? 0));
            const slipPercA = slippageToBignum(values.slippage)
              .multipliedBy(new BigNumber(values.balanceA ?? 0));
            const slipPercB = slippageToBignum(values.slippage)
              .multipliedBy(new BigNumber(values.balanceB ?? 0));
            const minimumReceivedA = new BigNumber(values.balanceA ?? 0).minus(slipPercA);
            const minimumReceivedB = new BigNumber(values.balanceB ?? 0).minus(slipPercB);
            const bal1 = new BigNumber(values.balance1);
            const bal2 = new BigNumber(values.balance2);
            const exA = new BigNumber(tokensData.first.exchangeRate ?? '1');
            const exB = new BigNumber(tokensData.second.exchangeRate ?? '1');
            const initialAto$ = bal1.multipliedBy(exA);
            const initialBto$ = bal2.multipliedBy(exB);
            const total$ = initialAto$
              .plus(initialBto$)
              .div(2); // Total amount of Tokens pool in USD
            const maxInvestedA = total$
              .minus(slippageToBignum(values.slippage).multipliedBy(total$)).div(exA);
            const maxInvestedB = total$
              .minus(slippageToBignum(values.slippage).multipliedBy(total$)).div(exB);
            const maxInvestedLp = new BigNumber(values.estimateLP ?? 0).minus(slipPerc);
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
                        amount={maxInvestedLp.isNaN() ? '0' : maxInvestedLp.toString()}
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
                            amount={maxInvestedA.isNaN() ? '0' : maxInvestedA.toString()}
                          />
                        </div>
                        <div className={cx(s.receive, s.mb24)}>
                          <span className={s.receiveLabel}>
                            Max invested:
                          </span>
                          <CurrencyAmount
                            currency={tokenBName}
                            amount={maxInvestedB.isNaN() ? '0' : maxInvestedB.toString()}
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
                      amount={minimumReceivedA.isNaN() ? '0' : minimumReceivedA.toString()}
                    />
                  </div>
                  <div className={s.receive}>
                    <span className={s.receiveLabel}>
                      Minimum received:
                    </span>
                    <CurrencyAmount
                      currency={tokenBName}
                      amount={minimumReceivedB.isNaN() ? '0' : minimumReceivedB.toString()}
                    />
                  </div>
                  <Button
                    onClick={handleRemoveLiquidity}
                    className={s.button}
                    disabled={removeLiquidityParams.length < 1}
                  >
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
            <Button
              onClick={handleAddLiquidity}
              className={s.button}
              disabled={addLiquidityParams.length < 1}
            >
              {currentTab.label}
            </Button>
          </>
        )}

      </Card>
      <LiquidityDetails
        currentTab={currentTab.label}
        token1={token1}
        token2={token2}
        tokensData={tokensData}
        tokenPair={tokenPair}
        poolShare={poolShare}
        balanceTotalA={(values.balanceTotalA ?? 0).toString()}
        balanceTotalB={(values.balanceTotalB ?? 0).toString()}
        dex={dex}
      />
    </>
  );
};

export const LiquidityForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
