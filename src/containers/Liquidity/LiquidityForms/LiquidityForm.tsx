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
import {
  Token,
  findDex,
  FoundDex,
  getLiquidityShare,
} from '@quipuswap/sdk';
import { FormSpy } from 'react-final-form';
import router from 'next/router';

import {
  useTezos,
  useNetwork,
  useAccountPkh,
  getUserBalance,
} from '@utils/dapp';
import {
  QSMainNet,
  PoolShare,
  TokenDataMap,
  WhitelistedTokenPair,
} from '@utils/types';
import {
  FACTORIES,
  TEZOS_TOKEN,
  QUIPU_TOKEN,
} from '@utils/defaults';
import { fromDecimals, getWhitelistedTokenSymbol } from '@utils/helpers';
import { Transactions } from '@components/svg/Transactions';

import { LiquidityFormAdd } from './LiquidityFormAdd';
import { LiquidityDetails } from '../LiquidityDetails';
import { LiquidityFormRemove } from './LiquidityFormRemove';
import s from '../Liquidity.module.sass';

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

type LiquidityFormProps = {
  tokensData: TokenDataMap;
};

const RealForm:React.FC<LiquidityFormProps> = ({ tokensData }) => {
  const tezos = useTezos();
  const networkId = useNetwork().id as QSMainNet;
  const accountPkh = useAccountPkh();

  const [dex, setDex] = useState<FoundDex | null>(null);
  const [poolShare, setPoolShare] = useState<PoolShare>();
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
      try {
        const foundDex = await findDex(tezos, FACTORIES[networkId], token);

        if (isLoadDex) setDex(foundDex);
      } catch (error) {
        setDex(null);
      }
    };
    loadDex();

    return () => { isLoadDex = false; };
  }, [tezos, networkId, tokenB]);

  useEffect(() => {
    let isLoadBalances = true;
    const getTokensBalances = async () => {
      if (!tezos || !accountPkh) return;

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

      const userLpTokenBalance = dex && (await getUserBalance(
        tezos,
        accountPkh,
        dex.contract.address,
        tokenB.type,
        tokenB.fa2TokenId,
      ));

      if (userTokenABalanance && isLoadBalances) {
        setTokenABalance(fromDecimals(userTokenABalanance, tokenA.metadata.decimals).toFixed());
      } else if (!userTokenABalanance && isLoadBalances) {
        setTokenABalance('0');
      }

      if (userTokenBBalance && isLoadBalances) {
        setTokenBBalance(fromDecimals(userTokenBBalance, tokenB.metadata.decimals).toFixed());
      } else if (!userTokenBBalance && isLoadBalances) {
        setTokenBBalance('0');
      }

      if (userLpTokenBalance && isLoadBalances) {
        setLpTokenBalance(fromDecimals(userLpTokenBalance, 6).toFixed());
      } else if (!userLpTokenBalance && isLoadBalances) {
        setLpTokenBalance('0');
      }
    };
    getTokensBalances();

    return () => { isLoadBalances = false; };
  }, [tezos, accountPkh, tokenB, tokenA, dex]);

  useEffect(() => {
    let isLoadShares = true;
    const loadShares = async () => {
      if (!accountPkh || !tezos || !dex) return;

      const share = await getLiquidityShare(tezos, dex, accountPkh);

      if (isLoadShares) setPoolShare(share);
    };
    loadShares();

    return () => { isLoadShares = false; };
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
        {tabState.id === 'add' && (
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
        {tabState.id === 'remove' && (
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
