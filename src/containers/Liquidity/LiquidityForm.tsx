import { useTranslation } from 'next-i18next';
import router from 'next/router';
import React, {
  useEffect, useMemo, useRef, useState,
  useCallback,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { Field, FormSpy } from 'react-final-form';
import {
  addLiquidity,
  // Dex,
  estimateSharesInTez,
  estimateSharesInToken,
  estimateTezInShares,
  estimateTezInToken,
  estimateTokenInShares,
  estimateTokenInTez,
  findDex,
  FoundDex,
  getLiquidityShare,
  removeLiquidity,
  swap,
  TransferParams,
} from '@quipuswap/sdk';

import {
  useAccountPkh, useNetwork, useOnBlock, useTezos,
} from '@utils/dapp';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  LiquidityFormValues,
  PoolShare,
  TokenDataMap, TokenDataType,
  WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';

import {
  composeValidators, validateBalance, validateMinMax, validateRebalance,
} from '@utils/validators';
import {
  fromDecimals,
  getValueForSDK,
  getWhitelistedTokenSymbol, isDexEqual, isTokenEqual, parseDecimals, slippageToBignum, toDecimals,
} from '@utils/helpers';
import { Tooltip } from '@components/ui/Tooltip';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { Switcher } from '@components/ui/Switcher';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { Loader } from '@components/ui/Loader';
import { ComplexInput } from '@components/ui/ComplexInput';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
// import { Transactions } from '@components/svg/Transactions';
import { ArrowDown } from '@components/svg/ArrowDown';
import { Plus } from '@components/svg/Plus';

import s from './Liquidity.module.sass';

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
  removeLiquidityParams,
  setRemoveLiquidityParams,
  addLiquidityParams,
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const {
    openConnectWalletModal,
    connectWalletModalOpen,
    closeConnectWalletModal,
  } = useConnectModalsState();
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [dex, setDex] = useState<FoundDex>();
  const accountPkh = useAccountPkh();
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const [oldDex, setOldDex] = useState<FoundDex>();
  const updateToast = useUpdateToast();
  const [poolShare, setPoolShare] = useState<PoolShare>();
  const [[oldToken1, oldToken2], setOldTokens] = useState<WhitelistedToken[]>([token1, token2]);
  const [[localSwap, localInvest], setRebalance] = useState<BigNumber[]>([
    new BigNumber(0), new BigNumber(0),
  ]);

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: LiquidityFormValues) => {
    setAddLiquidityParams([]);
    if (token1.contractAddress !== TEZOS_TOKEN.contractAddress) return;
    if (currentTab.id !== 'remove') {
      if (!val[lastChange] || val[lastChange].toString() === '.') {
        if (!val.balance1 && !val.balance2) return;
        form.mutators.setValue(
          'balance1', undefined,
        );
        form.mutators.setValue(
          'balance2', undefined,
        );
        setAddLiquidityParams([]);
        return;
      }
    } else if (!val.balance3 || val.balance3.toString() === '.') {
      form.mutators.setValue(
        'balanceA', undefined,
      );
      form.mutators.setValue(
        'balanceB', undefined,
      );
      setAddLiquidityParams([]);
      return;
    }
    if (!dex) return;
    const isTokensSame = isTokenEqual(token1, oldToken1)
      && isTokenEqual(token2, oldToken2);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    const isRemValuesSame = val.balance3 === formValues.balance3;
    const isDexSame = dex && oldDex && isDexEqual(dex, oldDex);
    if (val.switcher !== formValues.switcher) setAddLiquidityParams([]);
    if (tezos && token1 && token2) {
      if (isDexSame && isTokensSame && ((currentTab.id === 'remove' ? isRemValuesSame : isValuesSame))) return;
      try {
        asyncGetLiquidityShare({
          setDex,
          setAddLiquidityParams,
          values,
          token1,
          token2,
          dex,
          tezos,
          networkId,
          updateToast: handleErrorToast,
        });
      } catch (e) {
        handleErrorToast(e);
      }
    }
    if (tezos) {
      if (currentTab.id === 'remove') {
        if ((isTokensSame && isRemValuesSame && isDexSame) || !dex || !values.balance3) return;
        try {
          const getMethod = async (
            token:WhitelistedToken,
            foundDex:FoundDex,
            value:BigNumber,
          ) => (token.contractAddress === 'tez'
            ? estimateTezInShares(foundDex.storage, value.toString())
            : estimateTokenInShares(foundDex.storage, value.toString()));
          const balance = toDecimals(new BigNumber(values.balance3), 6);
          const sharesA = await getMethod(
            token1,
            dex,
            balance,
          );
          const sharesB = await getMethod(
            token2,
            dex,
            balance,
          );
          const bal1 = fromDecimals(sharesA, token1.metadata.decimals);
          const bal2 = fromDecimals(sharesB, token2.metadata.decimals);

          const slippage = slippageToBignum(values.slippage).div(100);

          if (accountPkh) {
            const params = await removeLiquidity(
              tezos,
              dex,
              balance,
              slippage,
            );
            setRemoveLiquidityParams(params);
          }

          form.mutators.setValue('balanceA', bal1);
          form.mutators.setValue('balanceB', bal2);
        } catch (err) {
          handleErrorToast(err);
        }
      } else if (!val.switcher) {
        if (!val.balance1 && !val.balance2) return;
        if (isTokensSame && isValuesSame && isDexSame) return;
        if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;

        if (values.balance1 && accountPkh) {
          const tezValue = toDecimals(new BigNumber(values.balance1), 6);
          const addParams = await addLiquidity(
            tezos,
            dex,
            { tezValue },
          );
          setAddLiquidityParams(addParams);
        }

        const rate = toDecimals(dex.storage.storage.token_pool, TEZOS_TOKEN.metadata.decimals)
          .dividedBy(
            toDecimals(dex.storage.storage.tez_pool, token2.metadata.decimals),
          );
        const retValue = lastChange === 'balance1' ? new BigNumber(val.balance1).multipliedBy(rate) : new BigNumber(val.balance2).div(rate);
        const decimals = lastChange === 'balance1' ? token2.metadata.decimals : token1.metadata.decimals;

        const res = retValue.toFixed(decimals);
        form.mutators.setValue(
          lastChange === 'balance1' ? 'balance2' : 'balance1',
          res,
        );
        if (!dex || !val.balance1 || !val.balance2) return;
        try {
          const getMethod = async (
            token:TokenDataType,
            foundDex:FoundDex,
            value:BigNumber,
          ) => (isTez(token)
            ? estimateSharesInTez(foundDex.storage, getValueForSDK(token, value, tezos!))
            : estimateSharesInToken(foundDex.storage, getValueForSDK(token, value, tezos!)));
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
        } catch (err) {
          handleErrorToast(err);
        }
      } else {
        if (!dex || !accountPkh || !tezos) return;
        if ((val.balance1 && val.balance1.toString() === '.') || (val.balance2 && val.balance2.toString() === '.')) return;
        try {
          const bal1 = new BigNumber(values.balance1 ? values.balance1 : 0);
          const bal2 = new BigNumber(values.balance2 ? values.balance2 : 0);
          const exA = new BigNumber(1);
          const initialAto$ = toDecimals(bal1, TEZOS_TOKEN.metadata.decimals);
          const initialBto$ = estimateTezInToken(dex.storage,
            toDecimals(bal2, token2.metadata.decimals));
          const total$ = initialAto$
            .plus(initialBto$)
            .div(2)
            .integerValue(BigNumber.ROUND_DOWN);
          let inputValue:BigNumber;
          const val1 = initialAto$.minus(total$);
          const val2 = toDecimals(bal2, token2.metadata.decimals)
            .minus(estimateTokenInTez(dex.storage, total$));

          const whichTokenPoolIsGreater = val1
            .gt(val2);
          if (whichTokenPoolIsGreater) {
            inputValue = val1.div(exA);
          } else {
            inputValue = getValueForSDK(
              tokensData.second,
              fromDecimals(val2, token2.metadata.decimals),
              tezos,
            );
          }
          const fromAsset = 'tez';
          const toAsset = {
            contract: tokensData.second.token.address,
            id: tokensData.second.token.id ?? undefined,
          };
          const slippage = slippageToBignum(values.slippage).div(100);
          const swapParams = await swap(
            tezos,
            FACTORIES[networkId],
            !whichTokenPoolIsGreater ? toAsset : fromAsset,
            whichTokenPoolIsGreater ? toAsset : fromAsset,
            inputValue,
            slippage,
          );
          // const tezValue = toDecimals(total$, 6);
          const tezValue = total$;
          const addParams = await addLiquidity(
            tezos,
            dex,
            { tezValue },
          );
          console.log(tezValue.toString(), inputValue.toString());
          setRebalance([tezValue, inputValue]);
          const params = [...swapParams, ...addParams];
          setAddLiquidityParams(params);
        } catch (e) {
          handleErrorToast(e);
        }
      }
      setOldTokens([token1, token2]);
      setOldDex(dex);
    }
  };

  const getDex = useCallback(async () => {
    if (!tezos || !token2 || !token1) return;
    setOldDex(undefined);
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
      handleErrorToast(err);
    }
  }, [token2, token1, tezos, networkId, accountPkh, form.mutators, handleErrorToast]);

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
    getDex();
  }, [token2, token1, tezos, networkId, accountPkh, form.mutators, getDex]);

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
          if (!dex || !values.balance1 || !values.balance2) return;
          try {
            const getMethod = async (
              token:TokenDataType,
              foundDex:FoundDex,
              value:BigNumber,
            ) => (isTez(token)
              ? estimateSharesInTez(foundDex.storage, getValueForSDK(token, value, tezos!))
              : estimateSharesInToken(foundDex.storage, getValueForSDK(token, value, tezos!)));
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
            handleErrorToast(e);
          }
        }
      }
      // eslint-disable-next-line
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

  useEffect(() => {
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
    // eslint-disable-next-line
  }, [accountPkh, closeConnectWalletModal]);

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

  const field1Validator = useMemo(() => {
    if (values.switcher) {
      return composeValidators(validateRebalance(localSwap.toString(), localInvest.toString()),
        () => (new BigNumber(values.balance1).eq(0) && new BigNumber(values.balance2).eq(0) ? t('liquidity|Value has to be a greater than zero') : undefined));
    }
    return validateMinMax(0, Infinity);
  }, [values.switcher, localSwap, localInvest, t, values.balance1, values.balance2]);

  const tokenAName = useMemo(() => (token1 ? getWhitelistedTokenSymbol(token1) : 'Token A'), [token1]);
  const tokenBName = useMemo(() => (token2 ? getWhitelistedTokenSymbol(token2) : 'Token B'), [token2]);
  const frozenBalance = useMemo(() => (fromDecimals(new BigNumber(poolShare?.frozen ?? '0'), 6).toString()), [poolShare]);
  const unfrozenBalance = useMemo(() => (fromDecimals(new BigNumber(poolShare?.unfrozen ?? '0'), 6).toString()), [poolShare]);
  const totalBalance = useMemo(() => (fromDecimals(new BigNumber(poolShare?.unfrozen ?? '0'), 6)
    .plus(fromDecimals(new BigNumber(poolShare?.frozen ?? '0'), 6))
    .toString()), [poolShare]);

  const setToken2 = useCallback((token:WhitelistedToken) => {
    setTokens([(token1 || undefined), token]);
    if (token1) {
      hanldeTokenPairSelect(
        { token1, token2: token } as WhitelistedTokenPair,
        setTokenPair,
        handleTokenChange,
      );
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh, networkId, token1]);

  useOnBlock(tezos, getDex);

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
          // TODO:
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
        {currentTab.id === 'remove' && (
          <Field
            name="balance3"
            validate={composeValidators(
              validateMinMax(0, Infinity),
              validateBalance(new BigNumber(totalBalance)),
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
                    setDex(undefined);
                    setTokens([pair.token1, pair.token2]);
                    handleTokenChange(pair.token1, 'first');
                    handleTokenChange(pair.token2, 'second');
                    hanldeTokenPairSelect(
                      pair,
                      setTokenPair,
                      handleTokenChange,
                    );
                  }}
                  handleBalance={(value) => {
                    form.mutators.setValue(
                      'balance3',
                      +value,
                    );
                  }}
                  noBalanceButtons={!accountPkh}
                  balance={unfrozenBalance}
                  frozenBalance={frozenBalance}
                  totalBalance={totalBalance}
                  id="liquidity-remove-input"
                  label={t('liquidity|Select LP')}
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
          validate={validateMinMax(0, Infinity)}
        >
          {({ input, meta }) => (
            <ComplexInput
              {...input}
              token1={tokenPair.token1}
              handleBalance={() => {}}
              balance={tokensData.first.balance}
              exchangeRate={tokensData.first.exchangeRate}
              id="liquidity-token-A"
              label={t('liquidity|Output')}
              className={cx(s.input, s.mb24)}
              readOnly
              error={((meta.touched && meta.error) || meta.submitError)}
            />

          )}
        </Field>
        )}

        {currentTab.id !== 'remove' && (
        <Field
          name="balance1"
          validate={composeValidators(
            field1Validator,
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
              noBalanceButtons={!accountPkh}
              handleChange={(token) => {
                setDex(undefined);
                setAddLiquidityParams([]);
                setLastChange('balance1');
                handleTokenChange(token, 'first');
              }}
              balance={tokensData.first.balance}
              exchangeRate={tokensData.first.exchangeRate}
              id="liquidity-token-1"
              label={t('liquidity|Input')}
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
          validate={validateMinMax(0, Infinity)}
        >
          {({ input, meta }) => (
            <ComplexInput
              {...input}
              token1={tokenPair.token2}
              handleBalance={() => {}}
              balance={tokensData.second.balance}
              exchangeRate={tokensData.second.exchangeRate}
              id="liquidity-token-B"
              label={t('liquidity|Output')}
              className={cx(s.input, s.mb24)}
              readOnly
              error={((meta.touched && meta.error) || meta.submitError)}
            />
          )}
        </Field>
        )}
        {currentTab.id !== 'remove' && (
        <Field
          name="balance2"
          validate={composeValidators(
            field1Validator,
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
              noBalanceButtons={!accountPkh}
              handleChange={(token) => {
                setDex(undefined);
                setAddLiquidityParams([]);
                handleTokenChange(token, 'second');
              }}
              balance={tokensData.second.balance}
              exchangeRate={tokensData.second.exchangeRate}
              id="liquidity-token-2"
              label={t('liquidity|Input')}
              className={cx(s.input, s.mb24)}
              error={((meta.error) || meta.submitError)}
            />
          )}
        </Field>
        )}
        <Field initialValue="0.5 %" name="slippage">
          {({ input }) => {
            const slipPercA = slippageToBignum(values.slippage)
              .multipliedBy(new BigNumber(values.balanceA ?? 0));
            const slipPercB = slippageToBignum(values.slippage)
              .multipliedBy(new BigNumber(values.balanceB ?? 0));
            const minimumReceivedA = parseDecimals(new BigNumber(values.balanceA ?? 0).minus(slipPercA).toString() ?? '0', 0, Infinity, 6);
            const minimumReceivedB = parseDecimals(new BigNumber(values.balanceB ?? 0).minus(slipPercB).toString() ?? '0', 0, Infinity, 6);
            let maxInvestedA = new BigNumber(0);
            let maxInvestedB = new BigNumber(0);
            if (dex) {
              const bal1 = new BigNumber(values.balance1 ? values.balance1 : 0);
              const bal2 = new BigNumber(values.balance2 ? values.balance2 : 0);
              try {
                const initialAto$ = toDecimals(bal1, TEZOS_TOKEN.metadata.decimals);
                const initialBto$ = estimateTezInToken(dex.storage,
                  toDecimals(bal2, token2.metadata.decimals));
                const total$ = initialAto$
                  .plus(initialBto$)
                  .div(2)
                  .integerValue(BigNumber.ROUND_DOWN);
                const totalA = fromDecimals(total$, TEZOS_TOKEN.metadata.decimals);
                const totalB = fromDecimals(estimateTokenInTez(dex.storage, total$),
                  token2.metadata.decimals);
                maxInvestedA = totalA
                  .minus(slippageToBignum(values.slippage).multipliedBy(totalA));
                maxInvestedB = totalB
                  .minus(slippageToBignum(values.slippage)
                    .multipliedBy(totalB));
              } catch (e) {
                maxInvestedA = bal1;
                maxInvestedB = bal2;
              }
            }
            const maxA = parseDecimals(maxInvestedA.toString(), 0, Infinity, 6);
            const maxB = parseDecimals(maxInvestedB.toString(), 0, Infinity, 6);

            return (
              <>
                {(currentTab.id === 'remove' || values.switcher) && (<Slippage handleChange={(value) => input.onChange(value)} />)}
                {currentTab.id === 'add' && values.switcher && (
                  <>
                    <div className={s.receive}>
                      <span className={s.receiveLabel}>
                        {t('liquidity|Max invested')}
                        :
                      </span>
                      <CurrencyAmount
                        currency={tokenAName}
                        amount={maxA}
                      />
                    </div>
                    <div className={cx(s.receive, s.mb24)}>
                      <span className={s.receiveLabel}>
                        {t('liquidity|Max invested')}
                        :
                      </span>
                      <CurrencyAmount
                        currency={tokenBName}
                        amount={maxB}
                      />
                    </div>
                  </>
                )}

                {currentTab.id === 'remove' && (
                <>
                  <div className={s.receive}>
                    <span className={s.receiveLabel}>
                      {t('liquidity|Minimum received')}
                      :
                    </span>
                    <CurrencyAmount
                      currency={tokenAName}
                      amount={minimumReceivedA}
                    />
                  </div>
                  <div className={s.receive}>
                    <span className={s.receiveLabel}>
                      {t('liquidity|Minimum received')}
                      :
                    </span>
                    <CurrencyAmount
                      currency={tokenBName}
                      amount={minimumReceivedB}
                    />
                  </div>
                  <Button
                    onClick={handleRemoveLiquidity}
                    className={s.button}
                    disabled={accountPkh ? removeLiquidityParams.length < 1 : false}
                  >
                    {t('liquidity|Remove & Unvote')}
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
                  <span className={s.rebalance}>
                    {t('liquidity|Rebalance Liquidity')}
                  </span>
                  <Tooltip content={t('liquidity|Automatically adjust your token balance to a 50%-50% ratio. If you don\'t have enough token 1, this feature will convert token 2 to token 1 to receive an equal proportion.')} />
                </div>
              )}
            </Field>
            <Button
              onClick={handleAddLiquidity}
              className={s.button}
              disabled={accountPkh ? addLiquidityParams.length < 1 : false}
            >
              {addLiquidityParams.length > 0 ? currentTab.label : <Loader />}
            </Button>
          </>
        )}

      </Card>
      <LiquidityDetails
        currentTab={currentTab.label}
        token1={token1}
        token2={token2}
        tokensData={tokensData}
        poolShare={poolShare}
        dex={dex}
      />
    </>
  );
};

export const LiquidityForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
