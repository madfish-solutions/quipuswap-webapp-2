import React, { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';

import { Nullable, WhitelistedToken } from '@utils/types';

import s from '../Liquidity.module.sass';
import { AddLiquidityForm } from './add-liquidity-form';
import { LiquidityDetails } from './liquidity-details';
import { LiquidityTabs, TABS_CONTENT } from './liquidity-tabs';
import { RemoveLiquidityForm } from './remove-liquidity-form';
import { useLiquidityFormService } from './use-liquidity-form.service';

interface Props {
  onTokensChange: (token1: Nullable<WhitelistedToken>, token2: Nullable<WhitelistedToken>) => void;
}

export const LiquidityCards: FC<Props> = ({ onTokensChange }) => {
  const {
    dex,
    tab,
    handleChangeTab,
    tokenA,
    tokenB,
    tokenALoading,
    tokenBLoading,
    handleChangeTokenA,
    handleChangeTokenB,
    handleChangeTokensPair
  } = useLiquidityFormService({ onTokensChange });

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
            tokenALoading={tokenALoading}
            tokenBLoading={tokenBLoading}
            onTokenAChange={handleChangeTokenA}
            onTokenBChange={handleChangeTokenB}
          />
        ) : (
          <RemoveLiquidityForm dex={dex} tokenA={tokenA} tokenB={tokenB} onChangeTokensPair={handleChangeTokensPair} />
        )}
      </Card>
      <Card
        header={{
          content: (
            <div className={s.poolDetailsHeader}>
              <span className={s.poolDetailsHeader_Title}>Pool Details</span>
            </div>
          )
        }}
        contentClassName={s.LiquidityDetails}
      >
        <LiquidityDetails dex={dex} tokenA={tokenA} tokenB={tokenB} />
      </Card>
    </>
  );
};
