import { StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { PageTitleContainer, PoolDetailsCreate } from './components';

export const CreateNewPositionPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitleContainer dataTestId="v3LiqCreatePosition" titleText={t('liquidity|createPosition')} />
      <StickyBlock>
        <PoolDetailsCreate />
      </StickyBlock>
    </>
  );
};
