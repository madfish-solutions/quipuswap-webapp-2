import { AppRootRoutes } from '@app.router';
import { getTokenPairSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { NewLiquidityRoutes } from '../new-liquidity-routes.enum';
import { NewLiquidityFormTabs } from '../types';

export const getCpmmPoolLink = (tokenPair: [Token, Token]) => {
  const tokenPairSlug = getTokenPairSlug(...tokenPair);

  return `${AppRootRoutes.NewLiquidity}${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.add}/${tokenPairSlug}`;
};
