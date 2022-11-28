import { FC } from 'react';

import { StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { OpenNewPosition, PageTitleContainer } from './components';

export const V3ItemPage: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitleContainer dataTestId="v3LiqTitle" titleText={t('liquidity|Liquidity')} />
      <OpenNewPosition />

      <StickyBlock>body</StickyBlock>
    </>
  );
};
