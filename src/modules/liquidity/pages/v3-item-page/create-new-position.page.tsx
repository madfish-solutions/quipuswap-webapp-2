import { useTranslation } from '@translation';

import { PageTitleContainer } from './components';

export const CreateNewPositionPage = () => {
  const { t } = useTranslation();

  return <PageTitleContainer dataTestId="v3LiqCreatePosition" titleText={t('liquidity|createPosition')} />;
};
