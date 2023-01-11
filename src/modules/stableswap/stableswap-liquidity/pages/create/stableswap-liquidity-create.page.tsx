import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';
import { i18n } from '@translation';

import { CreateForm, DetailsRules } from './components';

export const StableswapLiquidityCreatePage = () => {
  return (
    <>
      <TestnetAlert />
      <PageTitle>{i18n.t('stableswap|newPool')}</PageTitle>

      <StickyBlock>
        <CreateForm />
        <DetailsRules />
      </StickyBlock>
    </>
  );
};
