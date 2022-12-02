import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { LiquidityV3PoolStats, OpenNewPosition, PageTitleContainer } from './components';
import { useV3ItemPageViewModel } from './use-v3-item-page.vm';

export const V3ItemPage: FC = observer(() => {
  const { t } = useTranslation();
  useV3ItemPageViewModel();

  return (
    <>
      <PageTitleContainer dataTestId="v3LiqTitle" titleText={t('liquidity|Liquidity')} />
      <LiquidityV3PoolStats />
      <OpenNewPosition />

      <StickyBlock>body</StickyBlock>
    </>
  );
});
