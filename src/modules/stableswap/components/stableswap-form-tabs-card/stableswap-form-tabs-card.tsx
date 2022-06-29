import { observer } from 'mobx-react-lite';

import { Card, SettingsButton, Skeleton, Tabs } from '@shared/components';
import { CFC } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

import { StableswapContentRoutes } from '../../stableswap-routes.enum';
import { StableswapFormTabs } from '../../types';
import { FormHeader } from '../form-header';
import { TabsContent, useStableswapFormTabsCardViewModel } from './use-stabledividends-form-tabs-card.vm';

interface Props {
  subpath: StableswapContentRoutes;
  tabActiveId: StableswapFormTabs;
}

export const StableswapFormTabsCard: CFC<Props> = observer(({ subpath, tabActiveId, children }) => {
  const { isLoading, changeTabHandle } = useStableswapFormTabsCardViewModel({ subpath });

  if (isLoading) {
    return <Skeleton className={styles.Skeleton} />;
  }

  return (
    <Card
      header={{
        content: <FormHeader subpath={subpath} />
      }}
      subheader={{
        content: (
          <Tabs
            values={TabsContent[subpath]}
            activeId={tabActiveId}
            setActiveId={id => changeTabHandle(id as StableswapFormTabs)}
            className={styles.tabs}
          />
        ),
        button: <SettingsButton colored />,
        className: styles.header
      }}
      contentClassName={styles.content}
      data-test-id="stableswapFromTabsCard"
    >
      {children}
    </Card>
  );
});
