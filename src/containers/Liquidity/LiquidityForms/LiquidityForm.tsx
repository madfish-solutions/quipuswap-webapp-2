import React, { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';

import { TabsContent, useViewModel } from '@containers/Liquidity/LiquidityForms/useViewModel';

import s from '../Liquidity.module.sass';
import { LiquidityFormContent } from './liquidity-form-content';

export const LiquidityForm: FC = () => {
  const { tabState, handleSetActiveId } = useViewModel();

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
        <LiquidityFormContent tab={tabState.id} />
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
