import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { FoundDex } from '@quipuswap/sdk';
import { FormSpy } from 'react-final-form';
import { useTranslation } from 'next-i18next';

import { useConnectModalsState } from '@hooks/useConnectModalsState';
import useUpdateToast from '@hooks/useUpdateToast';
import { QSMainNet, SwapFormValues, TokenDataMap, WhitelistedToken } from '@utils/types';
import { useAccountPkh, useTezos, useNetwork } from '@utils/dapp';
import { getWhitelistedTokenDecimals, parseDecimals } from '@utils/helpers';
import { FEE_RATE, TEZOS_TOKEN } from '@utils/defaults';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { SwapButton } from '@components/common/SwapButton';
// import { Transactions } from '@components/svg/Transactions';

import s from '@styles/CommonContainer.module.sass';
import { SwapDetails } from '../SwapDetails';
import { getDex } from '../swapHelpers';
import { SwapFormSlippage } from './SwapFormSlippage';
import { SwapFormTokenSelect } from './SwapFormTokenSelect';
import { SwapFormSend } from './SwapFormSend';
import { handleInputChange } from './swapFormHelpers';

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
  className?: string;
};

type SwapFormProps = {
  handleSubmit: () => void;
  debounce: number;
  save: any;
  values: SwapFormValues;
  form: any;
  tabsState: any;
  setTabsState: (state: string) => void;
  token1: WhitelistedToken;
  setToken1: (token: WhitelistedToken) => void;
  token2: WhitelistedToken;
  setToken2: (token: WhitelistedToken) => void;
  tokensData: TokenDataMap;
  handleSwapTokens: () => void;
  handleTokenChange: (token: WhitelistedToken, tokenNumber: 'first' | 'second') => void;
  currentTab: any;
};

const RealForm: React.FC<SwapFormProps> = ({
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
  const { t } = useTranslation(['swap']);
  const updateToast = useUpdateToast();
  const { openConnectWalletModal, connectWalletModalOpen, closeConnectWalletModal } =
    useConnectModalsState();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const [priceImpact, setPriceImpact] = useState<BigNumber>(new BigNumber(0));
  const [rate1, setRate1] = useState<BigNumber>(new BigNumber(0));
  const [rate2, setRate2] = useState<BigNumber>(new BigNumber(0));
  const [[dex1, dex2], setDex] = useState<FoundDex[]>([]);
  const [[oldDex1, oldDex2], setOldDex] = useState<FoundDex[]>([]);
  const [[dexStorage1, dexStorage2], setDexStorage] = useState<any>([]);
  const [[oldToken1, oldToken2], setOldTokens] = useState<WhitelistedToken[]>([token1, token2]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise: any;

  const handleErrorToast = useCallback(
    (err) => {
      updateToast({
        type: 'error',
        render: `${err.name}: ${err.message}`,
      });
    },
    [updateToast],
  );

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    handleInputChange({
      val: values,
      tezos,
      lastChange,
      form,
      token1,
      token2,
      oldToken1,
      oldToken2,
      dex1,
      dex2,
      dexStorage1,
      oldDex1,
      oldDex2,
      tokensData,
      formValues,
      networkId,
      handleErrorToast,
      setRate1,
      setRate2,
      setPriceImpact,
      setOldDex,
      setOldTokens,
    });
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
  }, [token1, token2, values, tokensData, tezos, accountPkh, dex1, dex2, dexStorage1]);

  useEffect(() => {
    form.mutators.setValue('recipient', accountPkh);
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
    // eslint-disable-next-line
  }, [accountPkh, closeConnectWalletModal]);

  useEffect(() => {
    form.mutators.setValue('balance1', undefined);
    form.mutators.setValue('balance2', undefined);
    // eslint-disable-next-line
  }, [networkId]);

  const handleSwapSubmit = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal();
      return;
    }
    handleSubmit();
  };

  useEffect(() => {
    if (!tezos || !token2 || !token1) return;
    const asyncFunc = async () => {
      const { dexes, storages } = await getDex({
        tezos,
        networkId,
        token1,
        token2,
      });
      setDex(dexes);
      setDexStorage(storages);
    };
    asyncFunc();
  }, [token2, token1, tezos, networkId]);

  const handleSwapButton = useCallback(() => {
    handleSwapTokens();
    if (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez') {
      setDex([dex2, dex1]);
      setDexStorage([dexStorage2, dexStorage1]);
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
    // eslint-disable-next-line
  }, [token1, token2, dex1, dex2, lastChange, values, form, dexStorage1, dexStorage2]);

  const blackListedTokens = useMemo(
    () => [...(token1 ? [token1] : []), ...(token2 ? [token2] : [])],
    [token1, token2],
  );
  const fee = useMemo(() => {
    let feeVal = new BigNumber(values.balance1) ?? new BigNumber(0);
    if (
      token1.contractAddress !== TEZOS_TOKEN.contractAddress &&
      token2.contractAddress !== TEZOS_TOKEN.contractAddress
    ) {
      feeVal = feeVal.times(2);
    }
    return parseDecimals(
      feeVal.times(FEE_RATE).toFixed(),
      0,
      Infinity,
      getWhitelistedTokenDecimals(TEZOS_TOKEN),
    );
  }, [token1.contractAddress, token2.contractAddress, values.balance1]);

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
          // TODO: wait untill implemented API
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
        <SwapFormTokenSelect
          token={token1}
          setToken={setToken1}
          blackListedTokens={blackListedTokens}
          handleTokenChange={handleTokenChange}
          form={form}
          setDex={setDex}
          tokensData={tokensData}
          setLastChange={(str) => setLastChange(str as 'balance1' | 'balance2')}
          label={t('swap|From')}
          id="swap-send-from"
          valueField="balance1"
          tokenNumber="first"
        />
        <SwapButton onClick={handleSwapButton} />
        <SwapFormTokenSelect
          className={s.mb24}
          token={token2}
          setToken={setToken2}
          blackListedTokens={blackListedTokens}
          handleTokenChange={handleTokenChange}
          form={form}
          setDex={setDex}
          tokensData={tokensData}
          setLastChange={(str) => setLastChange(str as 'balance1' | 'balance2')}
          label={t('swap|To')}
          id="swap-send-to"
          valueField="balance2"
          tokenNumber="second"
        />
        <SwapFormSend form={form} currentTab={currentTab} />
        <SwapFormSlippage values={values} token2={token2} />
        <Button
          disabled={
            values.balance1 === undefined ||
            values.balance1 === '' ||
            token2 === undefined ||
            dex1 === undefined
          }
          type="submit"
          onClick={handleSwapSubmit}
          className={s.button}
        >
          {currentTab.label}
        </Button>
      </Card>
      <SwapDetails
        dex1={dex1}
        dex2={dex2}
        currentTab={currentTab.label}
        token1={token1}
        token2={token2}
        fee={(fee ?? 0).toString()}
        tokensData={tokensData}
        priceImpact={priceImpact}
        rate1={rate1}
        rate2={rate2}
      />
    </>
  );
};

export const SwapForm = (props: any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
