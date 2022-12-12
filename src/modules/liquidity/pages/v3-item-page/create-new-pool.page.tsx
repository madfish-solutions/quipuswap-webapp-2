import { Button, ConnectWalletOrDoSomething, PageTitle } from '@shared/components';
import { useTranslation } from '@translation';

import { useCreateNewPoolPageViewModel } from './use-create-new-pool-page.vm';

export const CreateNewPoolPage = () => {
  const { t } = useTranslation();
  const { handleCreatePoolClick } = useCreateNewPoolPageViewModel();

  return (
    <>
      <PageTitle data-test-id="v3LiqCreatePool">{t('liquidity|newPool')}</PageTitle>
      <ConnectWalletOrDoSomething>
        <Button onClick={handleCreatePoolClick}>Click this button to create a kUSD/Grape pool</Button>
      </ConnectWalletOrDoSomething>
    </>
  );
};
