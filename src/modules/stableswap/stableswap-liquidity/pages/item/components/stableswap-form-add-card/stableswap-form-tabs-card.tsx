import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { StableswapFormTabs } from '@modules/stableswap/types';
import { Card, SettingsButton, Skeleton, Tabs } from '@shared/components';
import styles from '@styles/CommonContainer.module.scss';

import { FormHeader } from '../form-header';
import { TabsContent, useStableswapFormTabsCardViewModel } from './use-stableswap-form-tabs-card.vm';

interface Props {
  tabActiveId: StableswapFormTabs;
}

export const StableswapFormTabsCard: FC<Props> = observer(({ tabActiveId, children }) => {
  const { stableswapItem, changeTabHandle } = useStableswapFormTabsCardViewModel();

  if (!stableswapItem) {
    return <Skeleton className={styles.Skeleton} />;
  }

  return (
    <Card
      header={{
        content: <FormHeader />
      }}
      subheader={{
        content: (
          <Tabs
            values={TabsContent}
            activeId={tabActiveId}
            setActiveId={id => changeTabHandle(id as StableswapFormTabs)}
            className={styles.tabs}
          />
        ),
        button: <SettingsButton />,
        className: styles.header
      }}
      contentClassName={styles.content}
      data-test-id="stableswapFromTabsCard"
    >
      {children}
    </Card>
  );
});
