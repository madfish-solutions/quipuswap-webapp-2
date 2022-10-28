import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoCreateForm, NewLiquidityCard } from './components';
import { useNewLiquidityCreatePageViewModel } from './new-liquidity-create-page.vm';

export const CpmmNewLiquidityCreatePage: FC = observer(() => {
  const { t } = useTranslation();
  const params = useNewLiquidityCreatePageViewModel();

  return (
    <>
      <PageTitle data-test-id="dexTwoCreatePoolTitle">{t('common|Create')}</PageTitle>
      <StickyBlock>
        <NewLiquidityCard>
          <DexTwoCreateForm {...params} />
        </NewLiquidityCard>
      </StickyBlock>
    </>
  );
});
