import { FC } from 'react';

import { Card, Skeleton, Tabs } from '@shared/components';
import styles from '@styles/CommonContainer.module.scss';

import { YouvesFormTabs } from '../../types';
import { StakeForm } from './stake-form';
import { TabProps } from './tab-props.interface';
import { UnstakeForm } from './unstake-form';
import { TabsContent, useFarmingFormTabsCardViewModel } from './use-farming-form-tabs-card.vm';

export const YouvesFormTabsCard: FC<TabProps> = ({ ...props }) => {
  const noop = false;
  const { currentTab, setCurrentTab, isStakeForm } = useFarmingFormTabsCardViewModel();

  if (noop) {
    return <Skeleton className={styles.Skeleton} />;
  }

  return (
    <Card
      header={{
        content: (
          <Tabs
            values={TabsContent}
            activeId={currentTab}
            setActiveId={id => setCurrentTab(id as YouvesFormTabs)}
            className={styles.tabs}
          />
        ),
        className: styles.header
      }}
      contentClassName={styles.content}
      data-test-id="youvesFromTabsCard"
    >
      {isStakeForm ? <StakeForm {...props} /> : <UnstakeForm {...props} />}
    </Card>
  );
};
