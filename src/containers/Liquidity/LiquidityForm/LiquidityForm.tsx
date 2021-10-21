import router from 'next/router';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import BigNumber from 'bignumber.js';
import {FormSpy} from 'react-final-form';
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

import {useAccountPkh, useNetwork, useOnBlock, useTezos} from '@utils/dapp';
import useUpdateToast from '@hooks/useUpdateToast';
import {useConnectModalsState} from '@hooks/useConnectModalsState';
import {
  LiquidityFormValues,
  PoolShare,
  QSMainNet,
  TokenDataMap,
  TokenDataType,
  WhitelistedToken,
  WhitelistedTokenPair,
} from '@utils/types';
import {
  fromDecimals,
  getValueForSDK,
  getWhitelistedTokenSymbol,
  isDexEqual,
  isTokenEqual,
  parseDecimals,
  slippageToBignum,
  toDecimals,
} from '@utils/helpers';
import {FACTORIES, TEZOS_TOKEN} from '@utils/defaults';
import {Card} from '@components/ui/Card';
import {Tabs} from '@components/ui/Tabs';
// import { Transactions } from '@components/svg/Transactions';

import s from '../Liquidity.module.sass';

import {LiquidityDetails} from './LiquidityDetails';
import {LiquiditySlippage} from './LiquiditySlippage';
import {LiquidityFormRemove} from './LiquidityFormRemove';
import {LiquidityFormAdd} from './LiquidityFormAdd';
import {LiquiditySwitcher} from './LiquiditySwitcher';

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
  handleSubmit: (str: any) => void;
  setAddLiquidityParams: (params: TransferParams[]) => void;
  setRemoveLiquidityParams: (params: TransferParams[]) => void;
  addLiquidityParams: TransferParams[];
  removeLiquidityParams: TransferParams[];
  debounce: number;
  save: any;
  values: LiquidityFormValues;
  form: any;
  tabsState: any;
  dex: FoundDex;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  setTokens: (tokens: WhitelistedToken[]) => void;
  tokenPair: WhitelistedTokenPair;
  setTokenPair: (pair: WhitelistedTokenPair) => void;
  tokensData: TokenDataMap;
  handleTokenChange: (token: WhitelistedToken, tokenNumber: 'first' | 'second') => void;
  currentTab: any;
  setTabsState: (val: any) => void;
};

const isTez = (tokensData: TokenDataType) => tokensData.token.address === 'tez';

const RealForm: React.FC<LiquidityFormProps> = ({
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
  setRemoveLiquidityParams,
}) => {
  const {openConnectWalletModal, connectWalletModalOpen, closeConnectWalletModal} =
    useConnectModalsState();
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
    new BigNumber(0),
    new BigNumber(0),
  ]);

  const handleErrorToast = useCallback(
    (err) => {
      updateToast({
        type: 'error',
        render: `${err.name}: ${err.message}`,
      });
    },
    [updateToast],
  );

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise: any;

  const rebalanceLiquidityHandler = useCallback(
    async (val, localTezos, localDex) => {
      if (!localDex || !accountPkh || !localTezos) return;
      if (
        (val.balance1 && val.balance1.toString() === '.') ||
        (val.balance2 && val.balance2.toString() === '.')
      ) {
        return;
      }
      try {
        const bal1 = new BigNumber(values.balance1 ? values.balance1 : 0);
        const bal2 = new BigNumber(values.balance2 ? values.balance2 : 0);
        const exA = new BigNumber(1);
        const initialAto$ = toDecimals(bal1, TEZOS_TOKEN.metadata.decimals);
        const initialBto$ = estimateTezInToken(
          localDex.storage,
          toDecimals(bal2, token2.metadata.decimals),
        );
        const total$ = initialAto$.plus(initialBto$).div(2).integerValue(BigNumber.ROUND_DOWN);
        let inputValue: BigNumber;
        const val1 = initialAto$.minus(total$);
        const val2 = toDecimals(bal2, token2.metadata.decimals).minus(
          estimateTokenInTez(localDex.storage, total$),
        );

        const whichTokenPoolIsGreater = val1.gt(val2);
        if (whichTokenPoolIsGreater) {
          inputValue = val1.div(exA);
        } else {
          inputValue = getValueForSDK(
            tokensData.second,
            fromDecimals(val2, token2.metadata.decimals),
            localTezos,
          );
        }
        const fromAsset = 'tez';
        const toAsset = {
          contract: tokensData.second.token.address,
          id: tokensData.second.token.id ?? undefined,
        };
        const slippage = slippageToBignum(values.slippage).div(100);
        const swapParams = await swap(
          localTezos,
          FACTORIES[networkId],
          !whichTokenPoolIsGreater ? toAsset : fromAsset,
          whichTokenPoolIsGreater ? toAsset : fromAsset,
          inputValue,
          slippage,
        );
        // const tezValue = toDecimals(total$, 6);
        const tezValue = total$;
        const addParams = await addLiquidity(localTezos, localDex, {
          tezValue,
        });
        setRebalance([tezValue, inputValue]);
        const params = [...swapParams, ...addParams];
        setAddLiquidityParams(params);
      } catch (e) {
        handleErrorToast(e);
      }
    },
    [
      accountPkh,
      networkId,
      setAddLiquidityParams,
      token2.metadata.decimals,
      tokensData.second,
      values.balance1,
      values.balance2,
      values.slippage,
      handleErrorToast,
    ],
  );

  const addLiquidityHandler = useCallback(
    async (isTokensSame, isValuesSame, isDexSame, val, localTezos, localDex) => {
      if (!val.balance1 && !val.balance2) return;
      if (isTokensSame && isValuesSame && isDexSame) return;
      if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) {
        return;
      }

      if (values.balance1 && accountPkh) {
        const tezValue = toDecimals(new BigNumber(values.balance1), 6);
        const addParams = await addLiquidity(localTezos, localDex, {
          tezValue,
        });
        setAddLiquidityParams(addParams);
      }

      const rate = toDecimals(
        localDex.storage.storage.token_pool,
        TEZOS_TOKEN.metadata.decimals,
      ).dividedBy(toDecimals(localDex.storage.storage.tez_pool, token2.metadata.decimals));
      const retValue =
        lastChange === 'balance1'
          ? new BigNumber(val.balance1).times(rate)
          : new BigNumber(val.balance2).div(rate);
      const decimals =
        lastChange === 'balance1' ? token2.metadata.decimals : token1.metadata.decimals;

      const res = retValue.toFixed(decimals);
      form.mutators.setValue(lastChange === 'balance1' ? 'balance2' : 'balance1', res);
      if (!localDex || !val.balance1 || !val.balance2) return;
      try {
        const getMethod = async (token: TokenDataType, foundDex: FoundDex, value: BigNumber) =>
          isTez(token)
            ? estimateSharesInTez(foundDex.storage, getValueForSDK(token, value, localTezos))
            : estimateSharesInToken(foundDex.storage, getValueForSDK(token, value, localTezos));
        const sharesA = await getMethod(tokensData.first, localDex, new BigNumber(values.balance1));
        const sharesB = await getMethod(
          tokensData.second,
          localDex,
          lastChange === 'balance2' ? new BigNumber(values.balance2) : retValue,
        );

        const lp1 = fromDecimals(sharesA, tokensData.first.token.decimals);
        const lp2 = fromDecimals(sharesB, tokensData.second.token.decimals);

        form.mutators.setValue('estimateLP', lp1.plus(lp2));
      } catch (err) {
        handleErrorToast(err);
      }
    },
    [
      accountPkh,
      form.mutators,
      lastChange,
      setAddLiquidityParams,
      token1.metadata.decimals,
      token2.metadata.decimals,
      tokensData.first,
      tokensData.second,
      values.balance1,
      values.balance2,
      handleErrorToast,
    ],
  );

  const removeTabHandler = useCallback(
    async (isTokensSame, isRemValuesSame, isDexSame, localTezos) => {
      if ((isTokensSame && isRemValuesSame && isDexSame) || !dex || !values.balance3) {
        return;
      }
      try {
        const getMethod = async (token: WhitelistedToken, foundDex: FoundDex, value: BigNumber) =>
          token.contractAddress === 'tez'
            ? estimateTezInShares(foundDex.storage, value.toString())
            : estimateTokenInShares(foundDex.storage, value.toString());
        const balance = toDecimals(new BigNumber(values.balance3), 6);
        const sharesA = await getMethod(token1, dex, balance);
        const sharesB = await getMethod(token2, dex, balance);
        const bal1 = fromDecimals(sharesA, token1.metadata.decimals);
        const bal2 = fromDecimals(sharesB, token2.metadata.decimals);

        const slippage = slippageToBignum(values.slippage).div(100);

        if (accountPkh) {
          const params = await removeLiquidity(localTezos, dex, balance, slippage);
          setRemoveLiquidityParams(params);
        }

        form.mutators.setValue('balanceA', bal1);
        form.mutators.setValue('balanceB', bal2);
      } catch (err) {
        handleErrorToast(err);
      }
    },
    [
      accountPkh,
      dex,
      form.mutators,
      handleErrorToast,
      setRemoveLiquidityParams,
      token1,
      token2,
      values.balance3,
      values.slippage,
    ],
  );

  const handleInputChange = useCallback(
    async (val: LiquidityFormValues) => {
      if (token1.contractAddress !== TEZOS_TOKEN.contractAddress) return;
      if (currentTab.id !== 'remove') {
        if (!val[lastChange] || val[lastChange].toString() === '.') {
          if (!val.balance1 && !val.balance2) return;
          form.mutators.setValue('balance1', undefined);
          form.mutators.setValue('balance2', undefined);
          return;
        }
      } else if (!val.balance3 || val.balance3.toString() === '.') {
        form.mutators.setValue('balanceA', undefined);
        form.mutators.setValue('balanceB', undefined);
        return;
      }
      if (!dex) return;
      const isTokensSame = isTokenEqual(token1, oldToken1) && isTokenEqual(token2, oldToken2);
      const isRemValuesSame = val.balance3 === formValues.balance3;
      const isDexSame = dex && oldDex && isDexEqual(dex, oldDex);
      if (!tezos) return;
      if (currentTab.id === 'remove') {
        removeTabHandler(isTokensSame, isRemValuesSame, isDexSame, tezos);
      } else if (!val.rebalanceSwitcher) {
        addLiquidityHandler(isTokensSame, isRemValuesSame, isDexSame, val, tezos, dex);
      } else {
        rebalanceLiquidityHandler(val, tezos, dex);
      }
      setOldTokens([token1, token2]);
      setOldDex(dex);
    },
    [
      addLiquidityHandler,
      removeTabHandler,
      rebalanceLiquidityHandler,
      currentTab.id,
      dex,
      tezos,
      form.mutators,
      formValues,
      lastChange,
      oldDex,
      oldToken1,
      oldToken2,
      token1,
      token2,
    ],
  );

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
      const getMethod = async (token: WhitelistedToken, foundDex: FoundDex, value: BigNumber) =>
        token.contractAddress === 'tez'
          ? estimateTezInShares(foundDex.storage, value.toString())
          : estimateTokenInShares(foundDex.storage, value.toString());

      if (!accountPkh) return;
      const share = await getLiquidityShare(tezos, dexbuf, accountPkh);
      setPoolShare(share);
      const balanceAB = share.total;
      const sharesTotalA = await getMethod(token1, dexbuf, balanceAB.integerValue());
      const sharesTotalB = await getMethod(token2, dexbuf, balanceAB.integerValue());
      const balA1 = fromDecimals(sharesTotalA, 6).toString();
      const balA2 = fromDecimals(sharesTotalB, 6).toString();
      form.mutators.setValue('balanceTotalA', balA1);

      form.mutators.setValue('balanceTotalB', balA2);
    } catch (err) {
      handleErrorToast(err);
    }
  }, [token2, token1, tezos, networkId, accountPkh, form.mutators, handleErrorToast]);

  useEffect(() => {
    setPoolShare(undefined);
    form.mutators.setValue('balanceTotalA', 0);

    form.mutators.setValue('balanceTotalB', 0);
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
    currentTab,
  ]);

  useEffect(() => {
    const localSaveFunc = async () => {
      if (promise) {
        await promise;
      }
      setVal(values);
      setSubm(true);
      if (values.rebalanceSwitcher !== formValues.rebalanceSwitcher) {
        form.mutators.setValue('hiddenSwitcher', !values.hiddenSwitcher);
        if (!values.rebalanceSwitcher) {
          if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) {
            return;
          }
          const rate = new BigNumber(tokensData.first.exchangeRate).dividedBy(
            new BigNumber(tokensData.second.exchangeRate),
          );
          const retValue =
            lastChange === 'balance1'
              ? new BigNumber(values.balance1).times(rate)
              : new BigNumber(values.balance2).dividedBy(rate);
          const decimals =
            lastChange === 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;

          form.mutators.setValue(
            lastChange === 'balance1' ? 'balance2' : 'balance1',
            parseDecimals(retValue.toString(), 0, Infinity, decimals),
          );
          if (!dex || !values.balance1 || !values.balance2) return;
          try {
            const getMethod = async (token: TokenDataType, foundDex: FoundDex, value: BigNumber) =>
              isTez(token)
                ? estimateSharesInTez(foundDex.storage, getValueForSDK(token, value, tezos!))
                : estimateSharesInToken(foundDex.storage, getValueForSDK(token, value, tezos!));
            const sharesA = await getMethod(tokensData.first, dex, new BigNumber(values.balance1));
            const sharesB = await getMethod(
              tokensData.second,
              dex,
              lastChange === 'balance2' ? new BigNumber(values.balance2) : retValue,
            );

            const lp1 = fromDecimals(sharesA, tokensData.first.token.decimals);
            const lp2 = fromDecimals(sharesB, tokensData.second.token.decimals);

            form.mutators.setValue('estimateLP', lp1.plus(lp2));
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
  }, [values.rebalanceSwitcher]);

  useEffect(() => {
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
    // eslint-disable-next-line
  }, [accountPkh, closeConnectWalletModal]);

  const handleAddLiquidity = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal();
      return;
    }
    handleSubmit('add');
  };

  const handleRemoveLiquidity = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal();
      return;
    }
    handleSubmit('remove');
  };

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
                  `/liquidity/${val}/${getWhitelistedTokenSymbol(
                    token1,
                  )}-${getWhitelistedTokenSymbol(token2)}`,
                  undefined,
                  {shallow: true},
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
        <LiquidityFormRemove
          tab={currentTab.id as 'remove' | 'add'}
          handleTokenChange={handleTokenChange}
          tokenPair={tokenPair}
          tokensData={tokensData}
          setTokenPair={setTokenPair}
          setTokens={setTokens}
          setDex={setDex}
          poolShare={poolShare}
          form={form}
        />
        <LiquidityFormAdd
          tab={currentTab.id as 'remove' | 'add'}
          handleTokenChange={handleTokenChange}
          tokenPair={tokenPair}
          tokensData={tokensData}
          setTokenPair={setTokenPair}
          setTokens={setTokens}
          setDex={setDex}
          values={values}
          token1={token1}
          token2={token2}
          setLastChange={setLastChange}
          localInvest={localInvest}
          localSwap={localSwap}
          form={form}
        />
        <LiquiditySlippage
          handleRemoveLiquidity={handleRemoveLiquidity}
          tab={currentTab.id}
          dex={dex}
          values={values}
          token1={token1}
          token2={token2}
        />
        <LiquiditySwitcher
          dex={dex}
          handleAddLiquidity={handleAddLiquidity}
          currentTab={currentTab}
        />
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

export const LiquidityForm = (props: any) => (
  <FormSpy {...props} subscription={{values: true}} component={RealForm} />
);
