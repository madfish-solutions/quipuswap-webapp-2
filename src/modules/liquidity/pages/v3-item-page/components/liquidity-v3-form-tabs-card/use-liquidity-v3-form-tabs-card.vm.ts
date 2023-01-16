import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { useLiquidityV3PoolStore, useLiquidityV3PositionStore } from '@modules/liquidity/hooks';
import { LiquidityRoutes, LiquidityTabs } from '@modules/liquidity/liquidity-routes.enum';
import { i18n } from '@translation';

const TabsContent = [
  {
    id: LiquidityTabs.add,
    label: i18n.t('common|Add')
  },
  {
    id: LiquidityTabs.remove,
    label: i18n.t('common|Remove')
  }
];

export const useLiquidityV3FromTabsCard = () => {
  const { positionId } = useLiquidityV3PositionStore();
  const { poolId } = useLiquidityV3PoolStore();
  const navigate = useNavigate();

  const backHref = `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}/${poolId}`;

  const changeTabHandle = useCallback(
    (tab: LiquidityTabs) => {
      const url = `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}/${poolId}/${tab}/${positionId}`;

      navigate(url);
    },
    [navigate, positionId, poolId]
  );

  return {
    TabsContent,
    isLoading: false,
    changeTabHandle,
    backHref
  };
};
