import { FC } from 'react';

import styles from '@styles/CommonContainer.module.sass';
import { observer } from 'mobx-react-lite';

import { Card, Skeleton, Tabs } from '@shared/components';

import { FarmingFormTabs } from '../../types';
import { StakeForm } from './stake-form/stake-form';
import { UnstakeForm } from './unstake-form/unstake-form';
import { TabsContent, useFarmingFormTabsCardViewModel } from './use-farming-form-tabs-card.vm';

export const FarmingFormTabsCard: FC = observer(() => {
  const { farmingItem, currentTab, isStakeForm, changeTabHandle } = useFarmingFormTabsCardViewModel();

  if (!farmingItem) {
    return <Skeleton className={styles.Skeleton} />;
  }

  return (
    <Card
      header={{
        content: (
          <Tabs
            values={TabsContent}
            activeId={currentTab}
            setActiveId={id => changeTabHandle(id as FarmingFormTabs)}
            className={styles.tabs}
          />
        ),
        className: styles.header
      }}
      contentClassName={styles.content}
    >
      {isStakeForm ? <StakeForm /> : <UnstakeForm />}
    </Card>
  );
});
