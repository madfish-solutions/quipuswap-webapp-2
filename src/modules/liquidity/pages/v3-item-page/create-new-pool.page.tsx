import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { CreatePoolForm } from './components';

export const CreateNewPoolPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle data-test-id="v3LiqCreatePool">{t('liquidity|newPool')}</PageTitle>
      <StickyBlock>
        <CreatePoolForm />
      </StickyBlock>
    </>
  );
};
