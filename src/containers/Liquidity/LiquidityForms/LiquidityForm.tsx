import React, { useCallback, useEffect, useState } from 'react';
import {
  Tabs,
  Card,
  Button,
} from '@quipuswap/ui-kit';
import { findDex, FoundDex, Token } from '@quipuswap/sdk';
import { FormSpy } from 'react-final-form';
import router from 'next/router';

import { QSMainNet, TokenDataMap, WhitelistedTokenPair } from '@utils/types';
import { FACTORIES, STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { useNetwork, useTezos } from '@utils/dapp';
import { Transactions } from '@components/svg/Transactions';

import { LiquidityFormRemove } from './LiquidityFormRemove';
import { LiquidityFormAdd } from './LiquidityFormAdd';
import { LiquidityDetails } from '../LiquidityDetails';
import s from '../Liquidity.module.sass';

const tokenDataMap:TokenDataMap = {
  first: {
    token: {
      address: 'qwe',
      type: 'fa1.2',
      decimals: 6,
    },
    balance: '123',
  },
  second: {
    token: {
      address: 'asd',
      type: 'fa1.2',
      decimals: 6,
    },
    balance: '345',
  },
};

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: STABLE_TOKEN,
} as WhitelistedTokenPair;

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

const QUIPU_TOKEN:Token = { contract: 'KT1NfYbYTCRZsNPZ97VdLqSrwPdVupiqniFu', id: 0 };

const RealForm:React.FC = () => {
  const tezos = useTezos();
  const networkId = useNetwork().id as QSMainNet;

  const [tabState, setTabState] = useState(TabsContent[0]);
  const [dex, setDex] = useState<FoundDex>();

  useEffect(() => {
    let isLoadDex = true;
    const loadDex = async () => {
      if (!tezos || !isLoadDex) return;

      const foundDex = await findDex(tezos, FACTORIES[networkId], QUIPU_TOKEN);

      setDex(foundDex);
    };

    loadDex();

    return () => { isLoadDex = false; };
  }, [tezos, networkId]);

  const setActiveId = useCallback(
    (val:string) => {
      router.replace(
        `/liquidity/${val}/${getWhitelistedTokenSymbol(fallbackTokenPair.token1)}-${getWhitelistedTokenSymbol(fallbackTokenPair.token2)}`,
        undefined,
        { shallow: true },
      );
      const findActiveTab = TabsContent.find((tab) => tab.id === val);
      if (!findActiveTab) return;
      setTabState(findActiveTab);
    }, [],
  );

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabState.id}
              setActiveId={setActiveId}
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
        {tabState.id === 'add' && dex && (
          <LiquidityFormAdd dex={dex} />
        )}
        {tabState.id === 'remove' && dex && (
          <LiquidityFormRemove dex={dex} />
        )}
      </Card>
      <LiquidityDetails
        currentTab={tabState.label}
        token1={fallbackTokenPair.token1}
        token2={fallbackTokenPair.token2}
        tokensData={tokenDataMap}
        balanceTotalA="123"
        balanceTotalB="123"
      />
    </>
  );
};

export const LiquidityForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
