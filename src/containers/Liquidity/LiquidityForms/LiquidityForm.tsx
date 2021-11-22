import React, { useCallback, useEffect, useState } from 'react';
import {
  Tabs,
  Card,
  Button,
} from '@quipuswap/ui-kit';
import {
  findDex, FoundDex, getLiquidityShare, Token,
} from '@quipuswap/sdk';
import { FormSpy } from 'react-final-form';
import router from 'next/router';

import {
  PoolShare,
  QSMainNet,
  TokenDataMap,
  WhitelistedTokenPair,
} from '@utils/types';
import { FACTORIES, STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { Transactions } from '@components/svg/Transactions';

import { LiquidityFormRemove } from './LiquidityFormRemove';
import { LiquidityFormAdd } from './LiquidityFormAdd';
import { LiquidityDetails } from '../LiquidityDetails';
import s from '../Liquidity.module.sass';

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

type LiquidityFormProps = {
  tokensData: TokenDataMap;
};

const RealForm:React.FC<LiquidityFormProps> = ({ tokensData }) => {
  const tezos = useTezos();
  const networkId = useNetwork().id as QSMainNet;
  const accountPkh = useAccountPkh();

  const [tabState, setTabState] = useState(TabsContent[0]);
  const [poolShare, setPoolShare] = useState<PoolShare>();
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

  useEffect(() => {
    const loadShares = async () => {
      if (!accountPkh || !tezos || !dex) return;

      const share = await getLiquidityShare(tezos, dex, accountPkh);

      setPoolShare(share);
    };
    loadShares();
  }, [dex, accountPkh, tezos]);

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
        tokensData={tokensData}
        poolShare={poolShare}
        balanceTotalA="1"
        balanceTotalB="2"
      />
    </>
  );
};

export const LiquidityForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
