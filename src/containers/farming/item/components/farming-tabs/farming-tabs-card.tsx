import { FC } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';
import { observer } from 'mobx-react-lite';

import { Skeleton } from '@components/common/Skeleton';
import { FarmingTabs } from '@containers/farming/item/types';
import styles from '@styles/CommonContainer.module.sass';

import { StakeForm } from './stake-form/stake-form';
import { UnstakeForm } from './unstake-form/unstake-form';
import { TabsContent, useFarmingTabsCardViewModel } from './use-farming-tabs-card.vm';

export const FarmingTabsCard: FC = observer(() => {
  const { farmingItem, currentTab, isStakeForm, changeTabHandle } = useFarmingTabsCardViewModel();

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
            setActiveId={id => changeTabHandle(id as FarmingTabs)}
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
