import { FC } from 'react';

import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

export const V3ItemPage: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle data-test-id="v3LiqTitle">{t('common|Add')}</PageTitle>

      <StickyBlock>body</StickyBlock>
    </>
  );
};
