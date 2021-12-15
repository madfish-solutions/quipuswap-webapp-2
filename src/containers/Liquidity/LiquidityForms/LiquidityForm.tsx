import React from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';
import { FormSpy } from 'react-final-form';

import { LiquidityFormProps } from '@containers/Liquidity/LiquidityForms/LiquidityForm.props';
import { TabsContent, useLiquidityFormService } from '@containers/Liquidity/LiquidityForms/useLiquidityFormService';

import s from '../Liquidity.module.sass';
import { checkForTezInPair } from '../liquidutyHelpers';
import { AddTezToToken } from './AddTezToToken/AddTezToToken';
import { AddTokenToToken } from './AddTokenToToken/AddTokenToToken';
import { RemoveTezToToken } from './RemoveTezToToken/RemoveTezToToken';
import { RemoveTokenToToken } from './RemoveTokenToToken/RemoveTokenToToken';

const RealForm: React.FC<LiquidityFormProps> = ({ tokensData }) => {
  const { tabState, handleSetActiveId, tokenA, tokenB, setTokenA, setTokenB } = useLiquidityFormService();

  const isTezosToTokenDex = tokenA && tokenB && checkForTezInPair(tokenA.contractAddress, tokenB.contractAddress);
  const renderedAddTezToToken = tabState.id === 'add' && isTezosToTokenDex && tokenA && tokenB;
  const renderedRemoveTezToToken = tabState.id === 'remove' && isTezosToTokenDex && tokenA && tokenB;
  const renderedAddTokenToToken = tabState.id === 'add' && !isTezosToTokenDex && tokenA && tokenB;
  const renderedRemoveTokenToToken = tabState.id === 'remove' && !isTezosToTokenDex && tokenA && tokenB;

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
        {renderedAddTezToToken && (
          <AddTezToToken tokenA={tokenA} tokenB={tokenB} setTokenA={setTokenA} setTokenB={setTokenB} />
        )}
        {renderedRemoveTezToToken && (
          <RemoveTezToToken tokenA={tokenA} tokenB={tokenB} setTokenA={setTokenA} setTokenB={setTokenB} />
        )}
        {renderedAddTokenToToken && (
          <AddTokenToToken tokenA={tokenA} tokenB={tokenB} setTokenA={setTokenA} setTokenB={setTokenB} />
        )}
        {renderedRemoveTokenToToken && (
          <RemoveTokenToToken tokenA={tokenA} tokenB={tokenB} setTokenA={setTokenA} setTokenB={setTokenB} />
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
