import React, { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';

import { ErrorAlert } from '@components/common/ErrorAlert';
import { Skeleton } from '@components/common/Skeleton';
import { StateWrapper } from '@components/state-wrapper';
import { SomethingWentWrongError } from '@errors/SomethingWentWrongError.error';

import s from '../Liquidity.module.sass';
import { AddLiquidityForm } from './add-liquidity-form';
import { LiquidityDetails } from './liquidity-details';
import { LiquidityTabs, TABS_CONTENT } from './liquidity-tabs';
import { RemoveLiquidityForm } from './remove-liquidity-form';
import { useLiquidityFormService } from './use-liquidity-form.service';

export const LiquidityCards: FC = () => {
  const { dex, tab, handleChangeTab, tokenA, tokenB, handleChangeTokenA, handleChangeTokenB, handleChangeTokensPair } =
    useLiquidityFormService();

  const isLoading = !dex;
  const isError = (dex && !tokenA) || !tokenB;
  const isLoaded = dex && tokenA && tokenB;

  const getFormContent = () => {
    const isAddTabActive = tab.id === 'add';

    return isAddTabActive ? (
      <AddLiquidityForm
        dex={dex!}
        tokenA={tokenA!}
        tokenB={tokenB!}
        onTokenAChange={handleChangeTokenA}
        onTokenBChange={handleChangeTokenB}
      />
    ) : (
      <RemoveLiquidityForm dex={dex!} tokenA={tokenA!} tokenB={tokenB!} onChangeTokensPair={handleChangeTokensPair} />
    );
  };

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
        <StateWrapper
          isLoading={isLoading}
          loaderFallback={<Skeleton width={450} height={500} />}
          isError={isError}
          errorFallback={<ErrorAlert error={new SomethingWentWrongError()} />}
        >
          {isLoaded && getFormContent()}
        </StateWrapper>
      </Card>
      <Card
        header={{
          content: `${tab.label} Liquidity Details`
        }}
        contentClassName={s.LiquidityDetails}
      >
        <StateWrapper
          isLoading={isLoading}
          loaderFallback={<Skeleton width={450} height={270} />}
          isError={isError}
          errorFallback={<ErrorAlert error={new SomethingWentWrongError()} />}
        >
          {isLoaded && <LiquidityDetails dex={dex!} tokenA={tokenA!} tokenB={tokenB!} />}
        </StateWrapper>
      </Card>
    </>
  );
};
