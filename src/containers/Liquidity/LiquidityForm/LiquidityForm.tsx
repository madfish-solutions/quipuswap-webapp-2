import router from 'next/router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { FormSpy } from 'react-final-form';
import {
  // Dex,
  estimateTezInShares,
  estimateTokenInShares,
  findDex,
  FoundDex,
  getLiquidityShare,
  TransferParams,
} from '@quipuswap/sdk';

import { useAccountPkh, useNetwork, useOnBlock, useTezos } from '@utils/dapp';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  LiquidityFormValues,
  PoolShare,
  QSMainNet,
  TokenDataMap,
  WhitelistedToken,
  WhitelistedTokenPair,
} from '@utils/types';
import { fromDecimals, getWhitelistedTokenSymbol, isDexEqual, isTokenEqual } from '@utils/helpers';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
// import { Transactions } from '@components/svg/Transactions';

import s from '../Liquidity.module.sass';

import { LiquidityDetails } from './LiquidityDetails';
import { LiquiditySlippage } from './LiquiditySlippage';
import { LiquidityFormRemove } from './LiquidityFormRemove';
import { LiquidityFormAdd } from './LiquidityFormAdd';
import { LiquiditySwitcher } from './LiquiditySwitcher';
import {
  inputUpdateHandler,
  addLiquidityHandler,
  rebalanceLiquidityHandler,
  removeTabHandler,
} from './liquidityFormHelpers';

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
  handleTokenChange: (arg: any) => void;
  currentTab: any;
  setTabsState: (val: any) => void;
};

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
}) => {
  const { openConnectWalletModal, connectWalletModalOpen, closeConnectWalletModal } =
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
      const isValuesSame = val[lastChange] === formValues[lastChange];
      const isDexSame = dex && oldDex && isDexEqual(dex, oldDex);
      if (!tezos) return;
      if (currentTab.id === 'remove') {
        removeTabHandler({
          isTokensSame,
          isRemValuesSame,
          isDexSame: !!isDexSame,
          dex,
          values,
          token1,
          token2,
          form,
        });
      } else if (!val.rebalanceSwitcher) {
        addLiquidityHandler({
          isTokensSame,
          isValuesSame,
          isDexSame: !!isDexSame,
          val,
          values,
          token1,
          token2,
          tokensData,
          lastChange,
          localTezos: tezos,
          localDex: dex,
          form,
        });
      } else {
        const data = rebalanceLiquidityHandler({
          val,
          values,
          localTezos: tezos,
          localDex: dex,
          token2,
          accountPkh,
          tokensData,
        });
        if (data) {
          setRebalance(data);
        }
      }
      setOldTokens([token1, token2]);
      setOldDex(dex);
    },
    [
      accountPkh,
      form,
      tokensData,
      values,
      currentTab.id,
      dex,
      tezos,
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
        inputUpdateHandler({
          values,
          tokensData,
          lastChange,
          token1,
          token2,
          dex,
          tezos,
          form,
        });
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
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
