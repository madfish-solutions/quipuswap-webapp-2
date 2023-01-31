import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { CreatePoolForm, Guides } from './components';

export const CreateNewPoolPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle data-test-id="v3LiqCreatePool">{t('liquidity|newPool')}</PageTitle>
      <StickyBlock>
        <CreatePoolForm />
        <Guides />
      </StickyBlock>
    </>
  );
};
