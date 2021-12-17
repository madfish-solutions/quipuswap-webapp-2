import { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';

import { LiquidityTabsEnum, TABS_CONTENT } from '@containers/Liquidity/LiquidityForms/liquidity-tabs';
import { useLiquidityFormContent } from '@containers/Liquidity/LiquidityForms/use-liquidity-form-content';

import s from '../Liquidity.module.sass';
import { LiquidityFormContent } from './liquidity-form-content';

export const LiquidityForm: FC = () => {
  const { tab, handleChangeTab } = useLiquidityFormContent();

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
        <LiquidityFormContent tab={tab.id} />
      </Card>
    </>
  );
};
