import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { LiquidityFormTabsCard } from '@modules/liquidity/components';
import { useLiquidityItemStore } from '@modules/liquidity/hooks';
import { LoaderFallback, PageTitle, StickyBlock } from '@shared/components';

import { DexTwoAddLiqForm, DexTwoDetails, MigrateLiquidityCard } from './components';
import styles from './dex-two-add-liq.module.scss';
import { useDexTwoItemViewModel } from './dex-two-item.vm';
import { LiquidityTabs } from '../../liquidity-routes.enum';

export const DexTwoAddLiq: FC = observer(() => {
  const { t, title, migrateLiquidity } = useDexTwoItemViewModel();
  const liquidityItemStore = useLiquidityItemStore();

  if (!liquidityItemStore.item) {
    return <LoaderFallback />;
  }

  return (
    <>
      <PageTitle data-test-id="dexTwoAddLiqTitle">
        {t('common|Add')} {title}
      </PageTitle>

      <StickyBlock>
        <div className={styles.formAndMigrationContainer}>
          {migrateLiquidity.canMigrateLiquidity && <MigrateLiquidityCard />}
          <LiquidityFormTabsCard tabActiveId={LiquidityTabs.add}>
            <DexTwoAddLiqForm {...migrateLiquidity} />
          </LiquidityFormTabsCard>
        </div>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
});
