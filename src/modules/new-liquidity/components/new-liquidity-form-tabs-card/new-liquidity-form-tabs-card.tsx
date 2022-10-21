import { observer } from 'mobx-react-lite';

import { Card, SettingsButton, Skeleton, Tabs } from '@shared/components';
import { CFC } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

import { NewLiquidityFormTabs } from '../../types';
import { FormHeader } from '../form-header';
import { useNewLiquidityFormTabsCardViewModel } from './use-new-liquidity-form-tabs-card.vm';

interface Props {
  tabActiveId: NewLiquidityFormTabs;
}

export const NewLiquidityFormTabsCard: CFC<Props> = observer(({ tabActiveId, children }) => {
  const { isLoading, changeTabHandle, TabsContent } = useNewLiquidityFormTabsCardViewModel();

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
            setActiveId={id => changeTabHandle(id as NewLiquidityFormTabs)}
            className={styles.tabs}
          />
        ),
        button: <SettingsButton colored />,
        className: styles.header
      }}
      contentClassName={styles.content}
      data-test-id="newLiquidityFromTabsCard"
    >
      {children}
    </Card>
  );
});
