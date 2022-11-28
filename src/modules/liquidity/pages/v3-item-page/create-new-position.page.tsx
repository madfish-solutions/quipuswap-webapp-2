import { StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { CommonForm, PageTitleContainer } from './components';

export const CreateNewPositionPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitleContainer dataTestId="v3LiqCreate" titleText={t('liquidity|createPosition')} />
      <StickyBlock>
        <CommonForm />
      </StickyBlock>
    </>
  );
};
