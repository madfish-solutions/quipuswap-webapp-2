import { StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { PageTitleContainer, PositionDetailsCreate } from './components';

export const CreateNewPositionPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitleContainer dataTestId="v3LiqCreatePosition" titleText={t('liquidity|createPosition')} />
      <StickyBlock>
        <PositionDetailsCreate />
      </StickyBlock>
    </>
  );
};
