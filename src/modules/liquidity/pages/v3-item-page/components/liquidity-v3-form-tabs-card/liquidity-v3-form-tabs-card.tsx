import { observer } from 'mobx-react-lite';

import { FormHeader } from '@modules/liquidity/components';
import { LiquidityTabs } from '@modules/liquidity/liquidity-routes.enum';
import { Card, SettingsButton, Skeleton, Tabs } from '@shared/components';
import { CFC } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

import { useLiquidityV3FromTabsCard } from './use-liquidity-v3-form-tabs-card.vm';

interface Props {
  tabActiveId: LiquidityTabs;
}

export const LiquidityV3FormTabsCard: CFC<Props> = observer(({ tabActiveId, children }) => {
  const { isLoading, changeTabHandle, TabsContent, backHref } = useLiquidityV3FromTabsCard();

  if (isLoading) {
    return <Skeleton className={styles.Skeleton} />;
  }

  return (
    <Card
      header={{
        content: <FormHeader href={backHref} />
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
