import React, { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';

import { ErrorAlert } from '@components/common/ErrorAlert';
import { LiquidityDetails } from '@containers/Liquidity/LiquidityForms/liquidity-details';

import s from '../Liquidity.module.sass';
import { AddLiquidityForm } from './add-liquidity-form';
import { LiquidityTabs, TABS_CONTENT } from './liquidity-tabs';
import { RemoveLiquidityForm } from './remove-liquidity-form';
import { useLiquidityFormService } from './use-liquidity-form.service';

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
              setActiveId={id => handleChangeTab(id as LiquidityTabs)}
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
      <LiquidityDetails dex={dex} tab={tab} tokenA={tokenA} tokenB={tokenB} />
    </>
  );
};
