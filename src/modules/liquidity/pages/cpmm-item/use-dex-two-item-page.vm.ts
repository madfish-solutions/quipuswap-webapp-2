import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { NOT_FOUND_ROUTE_NAME, SLASH } from '@config/constants';
import { useCpmmPairSlug, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { LiquidityRoutes } from '@modules/liquidity/liquidity-routes.enum';
import { getPenultimateElement, isExist } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useCpmmPairSlug();
  const liquidityItemStore = useLiquidityItemStore();
  const navigate = useNavigate();
  const location = useLocation();
  const action = getPenultimateElement(location.pathname.split(SLASH));

  useEffect(() => {
    if (isExist(pairSlug)) {
      liquidityItemStore.setTokenPairSlug(pairSlug);
      void liquidityItemStore.itemSore.load();
    }

    return () => liquidityItemStore.itemSore.resetData();
  }, [liquidityItemStore, pairSlug]);

  useEffect(() => {
    if (!isExist(pairSlug) || liquidityItemStore.itemApiError) {
      navigate(`${AppRootRoutes.Liquidity}${LiquidityRoutes.cpmm}/${action}/${NOT_FOUND_ROUTE_NAME}`);
    }
  }, [pairSlug, liquidityItemStore.itemApiError, navigate, action]);

  return {
    t,
    title: liquidityItemStore.pageTitle,
    isInitialized: pairSlug ? Boolean(liquidityItemStore.item) : true
  };
};
