import { useCallback } from 'react';

import BigNumber from 'bignumber.js';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { NOT_FOUND_LETTER_ROUTE_NAME } from '@config/constants';
import { StableswapRoutes } from '@modules/stableswap/stableswap-routes.enum';
import { useReady } from '@providers/use-dapp';
import { getRouterParts } from '@shared/helpers';

import { useStableswapItemStore } from '../store';

const TAB_NAME_INDEX = 2;

export const useGetStableswapItem = () => {
  const stableswapItemStore = useStableswapItemStore();
  const isReady = useReady();
  const navigate = useNavigate();
  const location = useLocation();
  const tab = getRouterParts(location.pathname)[TAB_NAME_INDEX];

  const getStableswapItem = useCallback(
    async (poolId: BigNumber) => {
      if (!isReady) {
        return;
      }

      try {
        stableswapItemStore.setPoolId(poolId);
        await stableswapItemStore.itemStore.load();
      } catch (error) {
        navigate(`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${tab}/${NOT_FOUND_LETTER_ROUTE_NAME}`);
      }
    },
    [isReady, stableswapItemStore, navigate, tab]
  );

  return { getStableswapItem };
};
