import React, { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';

import s from '../Liquidity.module.sass';
import { AddLiquidityForm } from './add-liquidity-form';
import { LiquidityDetails } from './liquidity-details';
import { LiquidityTabs, TABS_CONTENT } from './liquidity-tabs';
import { RemoveLiquidityForm } from './remove-liquidity-form';
import { useLiquidityFormService } from './use-liquidity-form.service';

export const LiquidityCards: FC = () => {
  const { dex, tab, handleChangeTab, tokenA, tokenB, handleChangeTokenA, handleChangeTokenB, handleChangeTokensPair } =
    useLiquidityFormService();

  const isAddTabActive = tab.id === 'add';

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TABS_CONTENT}
              activeId={tab.id}
              setActiveId={id => handleChangeTab(id as LiquidityTabs)}
              className={s.tabs}
            />
          ),
          className: s.header
        }}
        contentClassName={s.content}
      >
        {isAddTabActive ? (
          <AddLiquidityForm
            dex={dex}
            tokenA={tokenA}
            tokenB={tokenB}
            onTokenAChange={handleChangeTokenA}
            onTokenBChange={handleChangeTokenB}
          />
        ) : (
          <RemoveLiquidityForm dex={dex} tokenA={tokenA} tokenB={tokenB} onChangeTokensPair={handleChangeTokensPair} />
        )}
      </Card>
      <Card
        header={{
          content: `${tab.label} Liquidity Details`
        }}
        contentClassName={s.LiquidityDetails}
      >
        <LiquidityDetails dex={dex} tokenA={tokenA} tokenB={tokenB} />
      </Card>
    </>
  );
};
