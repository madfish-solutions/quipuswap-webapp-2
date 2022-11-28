import { useTranslation } from '@translation';

import { PageTitleContainer } from './components';

export const CreateNewPositionPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitleContainer dataTestId="v3LiqCreate" titleText={t('liquidity|createPosition')} />
    </div>
  );
};
