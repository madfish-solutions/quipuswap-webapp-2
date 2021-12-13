import React from 'react';
import { Card, Tabs } from '@quipuswap/ui-kit';
import { FormSpy } from 'react-final-form';

import { TabsContent, useViewModel } from '@containers/Liquidity/LiquidityForms/useViewModel';
import { LiquidityFormProps } from '@containers/Liquidity/LiquidityForms/LiquidityForm.props';
import { MAINNET_DEFAULT_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { LiquidityDetails } from '../LiquidityDetails';
import { AddTezToToken } from './AddTezToToken';
import { AddTokenToToken } from './AddTokenToToken';
import { RemoveTezToToken } from './RemoveTezToToken';
import { RemoveTokenToToken } from './RemoveTokenToToken';
import s from '../Liquidity.module.sass';

const RealForm:React.FC<LiquidityFormProps> = ({ tokensData }) => {
  const {
    // eslint-disable-next-line max-len
    tabState, setActiveId, dexInfo, tokenA, tokenB, setTokenA, setTokenB, tokenABalance, tokenBBalance, lpTokenBalance,
  } = useViewModel();
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
          className: s.header,
        }}
        contentClassName={s.content}
      >
        {tabState.id === 'add' && dexInfo.isTezosToTokenDex && (
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
        {tabState.id === 'remove' && dexInfo.isTezosToTokenDex && (
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
        {tabState.id === 'add' && !dexInfo.isTezosToTokenDex && (
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
        {tabState.id === 'remove' && !dexInfo.isTezosToTokenDex && (
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
      {
        // TODO: Implement it
        false && (
          <LiquidityDetails
            currentTab={tabState.label}
            token1={TEZOS_TOKEN}
            token2={MAINNET_DEFAULT_TOKEN}
            tokensData={tokensData}
            balanceTotalA="1"
            balanceTotalB="2"
          />
        )
      }
    </>
  );
};

export const LiquidityForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
