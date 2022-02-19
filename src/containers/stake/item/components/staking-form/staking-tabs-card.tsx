import { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';
import { observer } from 'mobx-react-lite';

import { StakeForm } from '@containers/stake/item/components/staking-form/stake-form/stake-form';
import { UnstakeForm } from '@containers/stake/item/components/staking-form/unstake-form';
import { StakingTabs } from '@containers/stake/item/types';
import { useStakingFormStore } from '@hooks/stores/use-staking-form-store';
import s from '@styles/CommonContainer.module.sass';

export const TabsContent = [
  {
    id: StakingTabs.stake,
    label: 'Stake'
  },
  {
    id: StakingTabs.unstake,
    label: 'Unstake'
  }
];

export const StakingTabsCard: FC = observer(() => {
  const stakingFormStore = useStakingFormStore();
  if (!stakingFormStore.stakeItem) {
    return null;
  }

  const changeTabHandle = (tab: StakingTabs) => {
    stakingFormStore.setTab(tab);
  };

  const isStakeForm = stakingFormStore.currentTab === StakingTabs.stake;

  return (
    <Card
      header={{
        content: (
          <Tabs
            values={TabsContent}
            activeId={stakingFormStore.currentTab}
            setActiveId={id => changeTabHandle(id as StakingTabs)}
            className={s.tabs}
          />
        ),
        className: s.header
      }}
      contentClassName={s.content}
    >
      {isStakeForm ? <StakeForm /> : <UnstakeForm />}
    </Card>
  );
});
