import { observer } from 'mobx-react-lite';

import { Card, SettingsButton, Skeleton, Tabs } from '@shared/components';
import { CFC } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

import { useLiquidityFormTabsCardViewModel } from './use-liquidity-form-tabs-card.vm';
import { LiquidityTabs } from '../../liquidity-routes.enum';
import { FormHeader } from '../form-header';

interface Props {
  tabActiveId: LiquidityTabs;
}

export const LiquidityFormTabsCard: CFC<Props> = observer(({ tabActiveId, children }) => {
  const { isLoading, changeTabHandle, TabsContent } = useLiquidityFormTabsCardViewModel();

  if (isLoading) {
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
            tabs={TabsContent}
            activeId={tabActiveId}
            setActiveId={id => changeTabHandle(id as LiquidityTabs)}
            className={styles.tabs}
          />
        ),
        button: <SettingsButton colored />,
        className: styles.header
      }}
      contentClassName={styles.content}
      data-test-id="liquidityFromTabsCard"
    >
      {children}
    </Card>
  );
});
