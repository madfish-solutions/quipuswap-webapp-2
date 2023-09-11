import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Card, LoaderFallback, Tabs } from '@shared/components';
import styles from '@styles/CommonContainer.module.scss';

import { StakeForm } from './stake-form';
import { UnstakeForm } from './unstake-form';
import { useFarmingFormTabsCardViewModel } from './use-farming-form-tabs-card.vm';
import { YouvesFormTabs } from '../../types';

export const YouvesFormTabsCard: FC = observer(() => {
  const { canShowUnstakeForm, currentTab, setCurrentTab, isStakeForm, tabs } = useFarmingFormTabsCardViewModel();

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
      {isStakeForm && <StakeForm />}
      {canShowUnstakeForm && !isStakeForm && <UnstakeForm />}
      {!canShowUnstakeForm && !isStakeForm && <LoaderFallback />}
    </Card>
  );
});
