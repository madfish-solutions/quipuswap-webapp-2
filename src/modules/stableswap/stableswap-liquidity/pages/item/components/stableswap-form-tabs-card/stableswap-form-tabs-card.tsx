import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { StableswapFormTabs } from '@modules/stableswap/types';
import { Card, Skeleton, Tabs } from '@shared/components';
import styles from '@styles/CommonContainer.module.scss';

import { TabsContent, useStableswapFormTabsCardViewModel } from './stableswap-form-tabs-card.vm';

export const StableswapFormTabsCard: FC = observer(() => {
  const { isAddForm, currentTab, stableswapItem, changeTabHandle } = useStableswapFormTabsCardViewModel();

  if (!stableswapItem) {
    return <Skeleton className={styles.Skeleton} />;
  }

  return (
    <Card
      header={{
        content: (
          <Tabs
            values={TabsContent}
            activeId={currentTab}
            setActiveId={id => changeTabHandle(id as StableswapFormTabs)}
            className={styles.tabs}
          />
        ),
        className: styles.header
      }}
      contentClassName={styles.content}
      data-test-id="stableswapFromTabsCard"
    >
      {isAddForm ? <div>ADD LIQ TAB</div> : <div>REMOVE LIQ TAB</div>}
    </Card>
  );
});
