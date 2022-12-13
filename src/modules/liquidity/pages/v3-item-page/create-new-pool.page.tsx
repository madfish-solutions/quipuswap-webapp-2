import { PageTitle } from '@shared/components';
import { useTranslation } from '@translation';

export const CreateNewPoolPage = () => {
  const { t } = useTranslation();

  return <PageTitle data-test-id="v3LiqCreatePool">{t('liquidity|newPool')}</PageTitle>;
};
