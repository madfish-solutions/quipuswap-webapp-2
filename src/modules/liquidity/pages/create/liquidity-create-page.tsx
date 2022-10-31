import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoCreateForm, LiquidityCard } from './components';
import { useLiquidityCreatePageViewModel } from './liquidity-create-page.vm';

export const LiquidityCreatePage: FC = observer(() => {
  const { t } = useTranslation();
  const params = useLiquidityCreatePageViewModel();

  return (
    <>
      <PageTitle data-test-id="dexTwoCreatePoolTitle">{t('common|Create')}</PageTitle>
      <StickyBlock>
        <LiquidityCard>
          <DexTwoCreateForm {...params} />
        </LiquidityCard>
      </StickyBlock>
    </>
  );
});
