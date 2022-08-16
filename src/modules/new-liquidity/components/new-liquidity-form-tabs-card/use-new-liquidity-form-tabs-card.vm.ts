import { useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { NewLiquidityRoutes } from '@modules/new-liquidity/new-liquidity-routes.enum';
import { i18n } from '@translation';

import { NewLiquidityFormTabs } from '../../types';

export const TabsContent = [
  {
    id: NewLiquidityFormTabs.add,
    label: i18n.t('common|Add')
  },
  {
    id: NewLiquidityFormTabs.remove,
    label: i18n.t('common|Remove')
  }
];

export const useNewLiquidityFormTabsCardViewModel = () => {
  const navigate = useNavigate();
  const { pairSlug } = useParams();

  const changeTabHandle = useCallback(
    (tab: NewLiquidityFormTabs) => {
      const url = `${AppRootRoutes.NewLiquidity}${NewLiquidityRoutes.cpmm}/${tab}/${pairSlug}`;

      navigate(url);
    },
    [navigate, pairSlug]
  );

  return {
    isLoading: false, // TODO store initialize, when itemStore will be ready
    changeTabHandle
  };
};
