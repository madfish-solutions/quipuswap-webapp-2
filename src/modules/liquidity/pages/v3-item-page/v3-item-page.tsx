import { FC } from 'react';

import { StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { OpenNewPosition, PageTitleContainer } from './components';

export const V3ItemPage: FC = () => {
  const { t } = useTranslation();
  // eslint-disable-next-line no-console
  console.log('V3ItemPage');

  return (
    <>
      <PageTitleContainer dataTestId="v3LiqTitle" titleText={t('liquidity|Liquidity')} />
      <OpenNewPosition />

      <StickyBlock>body</StickyBlock>
    </>
  );
};
