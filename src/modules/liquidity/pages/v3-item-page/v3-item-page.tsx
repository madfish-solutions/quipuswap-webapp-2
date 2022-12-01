import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListStats, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { OpenNewPosition, PageTitleContainer, PoolDetails } from './components';
import { useV3ItemPageViewModel } from './use-v3-item-page.vm';

export const V3ItemPage: FC = observer(() => {
  const { t } = useTranslation();
  const { stats } = useV3ItemPageViewModel();

  return (
    <>
      <PageTitleContainer dataTestId="v3LiqTitle" titleText={t('liquidity|Liquidity')} />
      <ListStats stats={stats} slidesToShow={3} />
      <OpenNewPosition />

      <StickyBlock>
        <PoolDetails />
      </StickyBlock>
    </>
  );
});
