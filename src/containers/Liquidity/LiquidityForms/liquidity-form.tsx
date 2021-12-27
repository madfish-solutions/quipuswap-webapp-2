import React, { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';

import { ErrorAlert } from '@components/common/ErrorAlert';
import { AddLiquidityForm } from '@containers/Liquidity/LiquidityForms/add-liquidity-form';
import { LiquidityTabsEnum, TABS_CONTENT } from '@containers/Liquidity/LiquidityForms/liquidity-tabs';
import { RemoveLiquidityForm } from '@containers/Liquidity/LiquidityForms/remove-liquidity-form';
import { useLiquidityFormService } from '@containers/Liquidity/LiquidityForms/use-liquidity-form.service';

import s from '../Liquidity.module.sass';

export const LiquidityForm: FC = () => {
  const { dex, tab, handleChangeTab, tokenA, tokenB, handleChangeTokenA, handleChangeTokenB, handleChangeTokensPair } =
    useLiquidityFormService();

  if (!tokenA || !tokenB) {
    return <ErrorAlert error={new Error('Tokens should be defined')} />;
  }

  if (!dex) {
    return <ErrorAlert error={new Error('DexContract is loading')} />;
  }

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TABS_CONTENT}
              activeId={tab.id}
              setActiveId={id => handleChangeTab(id as LiquidityTabsEnum)}
              className={s.tabs}
            />
          ),
          className: s.header
        }}
        contentClassName={s.content}
      >
        {tab.id === 'add' ? (
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
    </>
  );
};
