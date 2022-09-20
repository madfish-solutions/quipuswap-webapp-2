import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoAddLiqForm, DexTwoDetails, MigrateLiquidityCard } from './components';
import styles from './dex-two-add-liq.module.scss';
import { useDexTwoAddLiqViewModel } from './dex-two-add-liq.vm';

export const DexTwoAddLiq = observer(() => {
  const { t } = useTranslation();
  const { pairSlug } = useParams();
  const migrationParams = useDexTwoAddLiqViewModel();

  return (
    <>
      <PageTitle data-test-id="dexTwoAddLiqTitle">
        {t('common|Add')} {pairSlug}
      </PageTitle>
      <StickyBlock>
        <div className={styles.formAndMigrationContainer}>
          {migrationParams.canMigrateLiquidity && <MigrateLiquidityCard />}
          <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.add}>
            <DexTwoAddLiqForm {...migrationParams} />
          </NewLiquidityFormTabsCard>
        </div>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
});
