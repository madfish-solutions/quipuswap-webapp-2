import { observer } from 'mobx-react-lite';

import { StableswapContentRoutes } from '@modules/stableswap/stableswap-routes.enum';
import { Card, SettingsButton, Skeleton, Tabs } from '@shared/components';
import { CFC } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

import { StableswapFormTabs } from '../../types';
import { FormHeader } from '../form-header';
import { TabsContent, useStableswapFormTabsCardViewModel } from './use-stableswap-form-tabs-card.vm';

interface Props {
  subpath: StableswapContentRoutes;
  tabActiveId: StableswapFormTabs;
}

export const StableswapFormTabsCard: CFC<Props> = observer(({ subpath, tabActiveId, children }) => {
  const { backHref, isLoading, changeTabHandle } = useStableswapFormTabsCardViewModel({ subpath });

  if (isLoading) {
    return <Skeleton className={styles.Skeleton} />;
  }

  return (
    <Card
      header={{
        content: <FormHeader backHref={backHref} />
      }}
      subheader={{
        content: (
          <Tabs
            tabs={TabsContent[subpath]}
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
