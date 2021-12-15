import React from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';
import { FormSpy } from 'react-final-form';

import { LiquidityFormProps } from '@containers/Liquidity/LiquidityForms/LiquidityForm.props';
import { TabsContent, useViewModel } from '@containers/Liquidity/LiquidityForms/useViewModel';

import s from '../Liquidity.module.sass';
import { AddTezToToken } from './AddTezToToken/AddTezToToken';
import { AddTokenToToken } from './AddTokenToToken/AddTokenToToken';
import { RemoveTezToToken } from './RemoveTezToToken/RemoveTezToToken';
import { RemoveTokenToToken } from './RemoveTokenToToken/RemoveTokenToToken';

const RealForm: React.FC<LiquidityFormProps> = ({ tokensData }) => {
  const {
    tabState,
    handleSetActiveId,
    dexInfo,
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance
  } = useViewModel();

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs values={TabsContent} activeId={tabState.id} setActiveId={handleSetActiveId} className={s.tabs} />
          ),
          className: s.header
        }}
        contentClassName={s.content}
      >
        {tabState.id === 'add' && dexInfo.isTezosToTokenDex && tokenA && tokenB && (
          <AddTezToToken
            dex={dexInfo.dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
          />
        )}
        {tabState.id === 'remove' && dexInfo.isTezosToTokenDex && tokenA && tokenB && (
          <RemoveTezToToken
            dex={dexInfo.dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
            lpTokenBalance={lpTokenBalance}
          />
        )}
        {tabState.id === 'add' && !dexInfo.isTezosToTokenDex && tokenA && tokenB && (
          <AddTokenToToken
            dex={dexInfo.dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
          />
        )}
        {tabState.id === 'remove' && !dexInfo.isTezosToTokenDex && tokenA && tokenB && (
          <RemoveTokenToToken
            dex={dexInfo.dex}
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
      {/*TODO: Implement it*/}
      {/*<LiquidityDetails*/}
      {/*  currentTab={tabState.label}*/}
      {/*  token1={TEZOS_TOKEN}*/}
      {/*  token2={MAINNET_DEFAULT_TOKEN}*/}
      {/*  tokensData={tokensData}*/}
      {/*  balanceTotalA="1"*/}
      {/*  balanceTotalB="2"*/}
      {/*/>*/}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LiquidityForm = (props: any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
