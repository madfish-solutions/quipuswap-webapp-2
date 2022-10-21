import { FC } from 'react';

import { Card, Tabs } from '@shared/components';
import styles from '@styles/CommonContainer.module.scss';

import { YouvesFormTabs } from '../../types';
import { StakeForm } from './stake-form';
import { UnstakeForm } from './unstake-form';
import { useFarmingFormTabsCardViewModel } from './use-farming-form-tabs-card.vm';

export const YouvesFormTabsCard: FC = props => {
  const { currentTab, setCurrentTab, isStakeForm, tabs } = useFarmingFormTabsCardViewModel();

  return (
    <Card
      header={{
        content: (
          <Tabs
            tabs={tabs}
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
