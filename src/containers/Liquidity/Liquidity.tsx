import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { withTypes, Field, FormSpy } from 'react-final-form';
import {
  addLiquidity,
  batchify,
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
import { TezosToolkit } from '@taquito/taquito';

import {
  getUserBalance,
  useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { usePrevious } from '@hooks/usePrevious';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import { composeValidators, required, validateMinMax } from '@utils/validators';
import {
  getWhitelistedTokenSymbol, isTokenEqual, parseDecimals, slippageToBignum, slippageToNum,
} from '@utils/helpers';
import { Tooltip } from '@components/ui/Tooltip';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { Switcher } from '@components/ui/Switcher';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { ComplexInput } from '@components/ui/ComplexInput';
import { StickyBlock } from '@components/common/StickyBlock';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { ArrowDown } from '@components/svg/ArrowDown';
import { Plus } from '@components/svg/Plus';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

import { asyncGetLiquidityShare } from './liquidityHelpers';

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

type LiquidityProps = {
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

const fallbackTokensData : TokenDataType = {
  token: {
    address: 'tez',
    type: 'fa1.2',
    decimals: 6,
    id: null,
  },
  balance: '0',
};

type FormValues = {
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

type HeaderProps = {
  handleSubmit: () => void,
  setAddLiquidityParams: (params:TransferParams[]) => void,
  setRemoveLiquidityParams: (params:TransferParams[]) => void,
  debounce:number,
  save:any,
  values:FormValues,
  form:any,
  tabsState:any,
  dex: FoundDex,
  setDex: (dex:FoundDex) => void,
  token1:WhitelistedToken,
  setToken1:(token:WhitelistedToken) => void,
  token2:WhitelistedToken,
  setToken2:(token:WhitelistedToken) => void,
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

const hanldeTokenPairSelect = (
  pair:WhitelistedTokenPair,
  setTokenPair: (pair:WhitelistedTokenPair) => void,
  handleTokenChange: (token:WhitelistedToken, tokenNum:'first' | 'second') => void,
  tezos:TezosToolkit | null,
  accountPkh:string | null,
  networkId?:QSMainNet,
) => {
  const asyncFunc = async () => {
    handleTokenChange(pair.token1, 'first');
    handleTokenChange(pair.token2, 'second');
    if (!tezos || !accountPkh || !networkId) {
      setTokenPair(pair);
      return;
    }
    try {
      const secondAsset = {
        contract: pair.token2.contractAddress,
        id: pair.token2.fa2TokenId,
      };
      const foundDex = await findDex(tezos, FACTORIES[networkId], secondAsset);
      const share = await getLiquidityShare(tezos, foundDex, accountPkh!!);

      // const lpTokenValue = share.total;
      const frozenBalance = share.frozen.div(
        new BigNumber(10)
          .pow(
            // new BigNumber(pair.token2.metadata.decimals),
            // NOT WORKING - CURRENT XTZ DECIMALS EQUALS 6!
            // CURRENT METHOD ONLY WORKS FOR XTZ -> TOKEN, so decimals = 6
            new BigNumber(6),
          ),
      ).toString();
      const totalBalance = share.total.div(
        new BigNumber(10)
          .pow(
            // new BigNumber(pair.token2.metadata.decimals),
            new BigNumber(6),
          ),
      ).toString();
      const res = {
        ...pair, frozenBalance, balance: totalBalance, dex: foundDex,
      };
      setTokenPair(res);
    } catch (err) {
      console.error(err);
    }
  };
  asyncFunc();
};

const Header:React.FC<HeaderProps> = ({
  handleSubmit,
  debounce,
  save,
  values,
  form,
  tabsState,
  dex,
  setDex,
  token1,
  token2,
  tokenPair,
  setToken1,
  setToken2,
  setTokenPair,
  tokensData,
  handleTokenChange,
  currentTab,
  setTabsState,
  setAddLiquidityParams,
  setRemoveLiquidityParams,
}) => {
  const { openConnectWalletModal } = useConnectModalsState();
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const accountPkh = useAccountPkh();
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const prevDex = usePrevious(dex);
  const [, setPoolShare] = useState<
  { unfrozen:BigNumber, frozen:BigNumber, total:BigNumber }
  >();

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: FormValues) => {
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
          id: tokensData.first.token.id ? tokensData.first.token.id : undefined,
        };
        const toAsset = isTez(tokensData.second) ? 'tez' : {
          contract: tokensData.second.token.address,
          id: tokensData.second.token.id ? tokensData.second.token.id : undefined,
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
  }, [values, token1, token2, tokenPair, dex, currentTab]);

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
      {currentTab.id === 'remove' && (
      <Field
        name="balance3"
        validate={composeValidators(
          required,
          validateMinMax(0, tokenPair.balance ? +tokenPair.balance : Infinity),
        )}
        parse={(v) => parseDecimals(v, 0, Infinity)}
      >
        {({ input, meta }) => (
          <>
            <PositionSelect
              {...input}
              tokenPair={tokenPair}
              setTokenPair={(pair) => hanldeTokenPairSelect(
                pair,
                setTokenPair,
                handleTokenChange,
                tezos,
                accountPkh,
                networkId,
              )}
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
          validateMinMax(0, tokensData.first.balance ? +tokensData.first.balance : Infinity),
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
                +parseDecimals(value, 0, Infinity, token1.metadata.decimals),
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
          validateMinMax(0, tokensData.second.balance ? +tokensData.second.balance : Infinity),
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
                +parseDecimals(value, 0, Infinity, token2.metadata.decimals),
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
                      currency={`${token1 ? getWhitelistedTokenSymbol(token1) : ''}/${token2 ? getWhitelistedTokenSymbol(token2) : ''}`}
                      amount={values.estimateLP ? values.estimateLP : '0'}
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
                          currency={token1 ? getWhitelistedTokenSymbol(token1) : ''}
                          amount={maxInvestedA.toString()}
                        />
                      </div>
                      <div className={cx(s.receive, s.mb24)}>
                        <span className={s.receiveLabel}>
                          Max invested:
                        </span>
                        <CurrencyAmount
                          currency={token2 ? getWhitelistedTokenSymbol(token2) : ''}
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
                      currency={tokenPair.token1 ? getWhitelistedTokenSymbol(tokenPair.token1) : ''}
                      amount={minimumReceivedA < 0 ? '0' : minimumReceivedA.toString()}
                    />
                  </div>
                  <div className={s.receive}>
                    <span className={s.receiveLabel}>
                      Minimum received:
                    </span>
                    <CurrencyAmount
                      currency={tokenPair.token2 ? getWhitelistedTokenSymbol(tokenPair.token2) : ''}
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
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: TEZOS_TOKEN,
} as WhitelistedTokenPair;

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const networkId = useNetwork().id as QSMainNet;
  const { t } = useTranslation(['common', 'liquidity']);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokensData,
      second: fallbackTokensData,
    },
  );

  const [removeLiquidityParams, setRemoveLiquidityParams] = useState<TransferParams[]>([]);
  const [addLiquidityParams, setAddLiquidityParams] = useState<TransferParams[]>([]);
  const { Form } = withTypes<FormValues>();
  const [dex, setDex] = useState<FoundDex>();
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([]);
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const handleTokenChange = async (token: WhitelistedToken, tokenNumber: 'first' | 'second') => {
    if (!exchangeRates || !exchangeRates.find) return;
    let finalBalance = '0';
    if (tezos && accountPkh) {
      const balance = await getUserBalance(
        tezos,
        accountPkh,
        token.contractAddress,
        token.type,
        token.fa2TokenId,
      );
      if (balance) {
        finalBalance = balance.div(
          new BigNumber(10)
            .pow(
              new BigNumber(token.metadata.decimals),
            ),
        ).toString();
      }
    }

    const tokenExchangeRate = exchangeRates.find((el: {
      tokenAddress: string,
      tokenId?: number,
      exchangeRate: string
    }) => (
      token.contractAddress === TEZOS_TOKEN.contractAddress && el.tokenAddress === undefined ? el
        : el.tokenAddress === token.contractAddress
      && (token.fa2TokenId ? el.tokenId === token.fa2TokenId : true)
    ));

    const newTokensData = {
      ...tokensData,
      [tokenNumber]: {
        token: {
          address: token.contractAddress,
          type: token.type,
          id: token.fa2TokenId,
          decimals: token.metadata.decimals,
        },
        balance: finalBalance,
        exchangeRate: tokenExchangeRate?.exchangeRate ?? null,
      },
    };

    setTokensData(newTokensData);
  };

  useEffect(() => {
    if (exchangeRates && tezos && accountPkh && !initialLoad) {
      setInitialLoad(true);
      if (!tokensData.first.exchangeRate) {
        handleTokenChange(
          {
            contractAddress: tokensData.first.token.address,
            type: tokensData.first.token.type,
            metadata:
            {
              decimals: tokensData.first.token.decimals,
            },
          } as WhitelistedToken, 'first',
        );
      }
      if (!tokensData.second.exchangeRate) {
        handleTokenChange(
          {
            contractAddress: tokensData.second.token.address,
            type: tokensData.second.token.type,
            metadata:
          {
            decimals: tokensData.second.token.decimals,
          },
          } as WhitelistedToken, 'second',
        );
      }
    }
  }, [exchangeRates, tezos, accountPkh]);

  return (
    <StickyBlock className={className}>
      <Form
        onSubmit={() => {
          if (!tezos) return;
          const asyncFunc = async () => {
            if (currentTab.id === 'remove') {
              try {
                const op = await batchify(
                  tezos.wallet.batch([]),
                  removeLiquidityParams,
                ).send();
                await op.confirmation();
              } catch (e) {
                console.error(e);
              }
            } else {
              try {
                const op = await batchify(
                  tezos.wallet.batch([]),
                  addLiquidityParams,
                ).send();
                await op.confirmation();
              } catch (e) {
                console.error(e);
              }
            }
          };
          asyncFunc();
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, form }) => (
          <AutoSave
            form={form}
            handleSubmit={handleSubmit}
            debounce={1000}
            save={() => {}}
            setTabsState={setTabsState}
            tabsState={tabsState}
            dex={dex}
            setDex={setDex}
            token1={token1}
            token2={token2}
            tokenPair={tokenPair}
            setToken1={(token:WhitelistedToken) => {
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
            }}
            setToken2={(token:WhitelistedToken) => {
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
            }}
            setTokenPair={setTokenPair}
            tokensData={tokensData}
            handleTokenChange={handleTokenChange}
            currentTab={currentTab}
            setRemoveLiquidityParams={setRemoveLiquidityParams}
            setAddLiquidityParams={setAddLiquidityParams}
          />
        )}
      />
      <Card
        header={{
          content: `${currentTab.label} Liquidity Details`,
        }}
        contentClassName={s.content}
      >
        <CardCell
          header={(
            <>
              {t('common:Sell Price')}
              <Tooltip
                sizeT="small"
                content={t('common:The amount of token B you receive for 1 token A, according to the current exchange rate.')}
              />
            </>
        )}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="tez" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="100000.11" currency="QPSP" dollarEquivalent="400" />
          </div>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Buy Price')}
              <Tooltip
                sizeT="small"
                content={t('common:The amount of token A you receive for 1 token B, according to the current exchange rate.')}
              />
            </>
        )}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="QPSP" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="1000000000.000011" currency="tez" dollarEquivalent="0.00004" />
          </div>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Token A Locked')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:The amount of token A that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="10000" currency="tez" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Token B Locked')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:The amount of token B that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="10000" currency="QPSP" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Your Total LP')}
              <Tooltip
                sizeT="small"
                content={t("liquidity:Total amount of this pool's LP tokens you will own after adding liquidity. LP (Liquidity Pool) tokens represent your current share in a pool.")}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="1000000" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Your Frozen LP')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="100" />
        </CardCell>
        <div className={s.detailsButtons}>
          <Button
            className={s.detailsButton}
            theme="inverse"
          >
            View Pair Analytics
            <ExternalLink className={s.linkIcon} />
          </Button>
          <Button
            className={s.detailsButton}
            theme="inverse"
          >
            View Pair Contract
            <ExternalLink className={s.linkIcon} />
          </Button>
        </div>
      </Card>
    </StickyBlock>

  );
};
