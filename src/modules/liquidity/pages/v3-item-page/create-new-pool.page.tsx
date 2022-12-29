import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { CreatePoolForm } from './components';

export const CreateNewPoolPage = () => {
  // eslint-disable-next-line no-console
  console.log('CreateNewPoolPage');
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
