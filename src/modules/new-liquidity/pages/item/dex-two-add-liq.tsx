import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';

import { DexTwoAddLiqForm, DexTwoDetails, MigrateLiquidityCard } from './components';
import styles from './dex-two-add-liq.module.scss';
import { useDexTwoItemViewModel } from './dex-two-item.vm';

export const DexTwoAddLiq: FC = observer(() => {
  const { t, title, migrateLiquidity } = useDexTwoItemViewModel();

  return (
    <>
      <PageTitle data-test-id="dexTwoAddLiqTitle">
        {t('common|Add')} {title}
      </PageTitle>

      <StickyBlock>
        <div className={styles.formAndMigrationContainer}>
          {migrateLiquidity.canMigrateLiquidity && <MigrateLiquidityCard />}
          <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.add}>
            <DexTwoAddLiqForm {...migrateLiquidity} />
          </NewLiquidityFormTabsCard>
        </div>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
});
