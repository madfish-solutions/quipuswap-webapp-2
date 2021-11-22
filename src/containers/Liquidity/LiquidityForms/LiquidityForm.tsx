import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Tabs,
  Card,
  Button,
} from '@quipuswap/ui-kit';
import { FoundDex, findDex, Token } from '@quipuswap/sdk';
import { FormSpy } from 'react-final-form';
import router from 'next/router';

import { QSMainNet, TokenDataMap, WhitelistedTokenPair } from '@utils/types';
import { FACTORIES, TEZOS_TOKEN, QUIPU_TOKEN } from '@utils/defaults';
import { fromDecimals, getWhitelistedTokenSymbol } from '@utils/helpers';
import {
  useTezos, useNetwork, getUserBalance, useAccountPkh,
} from '@utils/dapp';
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
  token2: QUIPU_TOKEN,
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

const RealForm:React.FC = () => {
  const tezos = useTezos();
  const networkId = useNetwork().id as QSMainNet;
  const accountPkh = useAccountPkh();

  const [dex, setDex] = useState<FoundDex>();
  const [tabState, setTabState] = useState(TabsContent[0]);
  const [tokenA, setTokenA] = useState(TEZOS_TOKEN);
  const [tokenB, setTokenB] = useState(QUIPU_TOKEN);
  const [tokenABalance, setTokenABalance] = useState<string>('0');
  const [tokenBBalance, setTokenBBalance] = useState<string>('0');
  const [lpTokenBalance, setLpTokenBalance] = useState<string>('0');

  useEffect(() => {
    let isLoadDex = true;
    const loadDex = async () => {
      if (!tezos) return;

      const token: Token = {
        contract: tokenB.contractAddress,
        id: tokenB.fa2TokenId,
      };

      const foundDex = await findDex(tezos, FACTORIES[networkId], token);

      if (isLoadDex) setDex(foundDex);
    };

    loadDex();

    return () => { isLoadDex = false; };
  }, [tezos, networkId, tokenB]);

  useEffect(() => {
    let isLoadBalances = true;
    const getTokensBalances = async () => {
      if (!tezos || !accountPkh || !dex) return;

      const userTokenABalanance = await getUserBalance(
        tezos,
        accountPkh,
        tokenA.contractAddress,
        tokenA.type,
        tokenA.fa2TokenId,
      );
      const userTokenBBalance = await getUserBalance(
        tezos,
        accountPkh,
        tokenB.contractAddress,
        tokenB.type,
        tokenB.fa2TokenId,
      );
      const userLpTokenBalance = await getUserBalance(
        tezos,
        accountPkh,
        dex.contract.address,
        tokenB.type,
        tokenB.fa2TokenId,
      );

      if (userTokenABalanance && isLoadBalances) {
        setTokenABalance(fromDecimals(userTokenABalanance, 6).toFixed(6));
      } else if (!userTokenABalanance && isLoadBalances) {
        setTokenABalance('0');
      }

      if (userTokenBBalance && isLoadBalances) {
        setTokenBBalance(fromDecimals(userTokenBBalance, 6).toFixed(6));
      } else if (!userTokenBBalance && isLoadBalances) {
        setTokenBBalance('0');
      }

      if (userLpTokenBalance && isLoadBalances) {
        setLpTokenBalance(fromDecimals(userLpTokenBalance, 6).toFixed(6));
      } else if (!userLpTokenBalance && isLoadBalances) {
        setLpTokenBalance('0');
      }
    };
    getTokensBalances();

    return () => { isLoadBalances = false; };
  }, [tezos, accountPkh, tokenB, tokenA, dex]);

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
          <LiquidityFormAdd
            dex={dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
          />
        )}
        {tabState.id === 'remove' && dex && (
          <LiquidityFormRemove
            dex={dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
            lpTokenBalance={lpTokenBalance}
          />
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
