import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Card, Skeleton, Tabs } from '@shared/components';
import styles from '@styles/CommonContainer.module.scss';

import { StakeForm } from './stake-form/stake-form';
import { UnstakeForm } from './unstake-form/unstake-form';
import { TabsContent, useFarmingFormTabsCardViewModel } from './use-farming-form-tabs-card.vm';
import { FarmingFormTabs } from '../../types';

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
            tabs={TabsContent}
            activeId={currentTab}
            setActiveId={id => changeTabHandle(id as FarmingFormTabs)}
            className={styles.tabs}
          />
        ),
        className: styles.header
      }}
      contentClassName={styles.content}
      data-test-id="farmingFromTabsCard"
    >
      {isStakeForm ? <StakeForm /> : <UnstakeForm />}
    </Card>
  );
});
