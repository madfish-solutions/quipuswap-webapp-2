import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';
import { i18n } from '@translation';

import { StableswapRoutes } from '../../../stableswap-routes.enum';
import { CreateForm } from './components';

export const StableswapLiquidityCreatePage = () => {
  return (
    <>
      <TestnetAlert />
      <PageTitle>{i18n.t('stableswap|newPool')}</PageTitle>

      <StickyBlock>
        <CreateForm subpath={StableswapRoutes.liquidity} />
      </StickyBlock>
    </>
  );
};
