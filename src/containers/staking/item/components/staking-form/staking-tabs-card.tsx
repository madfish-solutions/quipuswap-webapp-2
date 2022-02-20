import { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';
import { observer } from 'mobx-react-lite';

import { StakingForm } from '@containers/staking/item/components/staking-form/staking-form/staking-form';
import { UnstakeForm } from '@containers/staking/item/components/staking-form/unstake-form';
import { StakingTabs } from '@containers/staking/item/types';
import s from '@styles/CommonContainer.module.sass';

import { TabsContent, useStakingTabsCardViewModel } from './use-staking-tabs-card.vm';

export const StakingTabsCard: FC = observer(() => {
  const { stakeItem, currentTab, isStakeForm, changeTabHandle } = useStakingTabsCardViewModel();

  if (!stakeItem) {
    return null;
  }

  return (
    <Card
      header={{
        content: (
          <Tabs
            values={TabsContent}
            activeId={currentTab}
            setActiveId={id => changeTabHandle(id as StakingTabs)}
            className={s.tabs}
          />
        ),
        className: s.header
      }}
      contentClassName={s.content}
    >
      {isStakeForm ? <StakingForm /> : <UnstakeForm />}
    </Card>
  );
});
