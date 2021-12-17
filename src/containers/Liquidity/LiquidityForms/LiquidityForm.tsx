import React, { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';

import { LiquidityFormContent } from '@containers/Liquidity/LiquidityForms/liquidity-form-content';
import { TabsContent, useViewModel } from '@containers/Liquidity/LiquidityForms/useViewModel';

import s from '../Liquidity.module.sass';

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
    </>
  );
};
