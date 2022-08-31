import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoCreateForm, NewLiquidityCard } from './components';
import { useNewLiquidityCreatePageViewModel } from './new-liquidity-create-page.vm';

export const NewLiquidityCreatePage: FC = observer(() => {
  const { t } = useTranslation();
  const { data, bakerData, handleSubmit } = useNewLiquidityCreatePageViewModel();

  return (
    <>
      <PageTitle data-test-id="dexTwoCreatePoolTitle">{t('common|Create')}</PageTitle>
      <StickyBlock>
        <NewLiquidityCard>
          <DexTwoCreateForm data={data} bakerData={bakerData} onSubmit={handleSubmit} />
        </NewLiquidityCard>
      </StickyBlock>
    </>
  );
});
