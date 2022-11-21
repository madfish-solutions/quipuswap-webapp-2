import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { NOT_FOUND_ROUTE_NAME } from '@config/constants';
import { useCpmmPairSlug, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { LiquidityRoutes, LiquidityTabs } from '@modules/liquidity/liquidity-routes.enum';
import { getRouterParts, isExist } from '@shared/helpers';
import { useTranslation } from '@translation';

const TAB_NAME_INDEX = 2;

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useCpmmPairSlug();
  const liquidityItemStore = useLiquidityItemStore();
  const navigate = useNavigate();
  const location = useLocation();
  const tabName = getRouterParts(location.pathname)[TAB_NAME_INDEX];

  useEffect(() => {
    if (isExist(pairSlug)) {
      liquidityItemStore.setTokenPairSlug(pairSlug);
      void liquidityItemStore.itemSore.load();
    }

    return () => liquidityItemStore.itemSore.resetData();
  }, [liquidityItemStore, pairSlug]);

  useEffect(() => {
    if ((!isExist(pairSlug) || liquidityItemStore.itemApiError) && tabName !== LiquidityTabs.create) {
      navigate(`${AppRootRoutes.Liquidity}${LiquidityRoutes.cpmm}/${tabName}/${NOT_FOUND_ROUTE_NAME}`);
    }
  }, [pairSlug, liquidityItemStore.itemApiError, navigate, tabName]);

  return {
    t,
    title: liquidityItemStore.pageTitle,
    isInitialized: pairSlug ? Boolean(liquidityItemStore.item) : true
  };
};
