import { useEffect, useMemo } from 'react';

import {
  useGetLiquidityV3ItemWithPositions,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isExist } from '@shared/helpers';
import { useTranslation } from '@translation';

import { mapPositionViewModel } from './helpers/map-position-view-model';
import { useLiquidityV3ItemTokensExchangeRates } from './hooks';
import { usePositionsWithStats } from './hooks/use-positions-with-stats';

export const useV3PositionsViewModel = () => {
  const { t } = useTranslation();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { isExchangeRatesError } = useLiquidityV3ItemTokensExchangeRates();
  const { tezos } = useRootStore();
  const { getLiquidityV3ItemWithPositions } = useGetLiquidityV3ItemWithPositions();

  const poolId = v3PositionsStore.poolId;

  const warningAlertMessage = isExchangeRatesError ? t('liquidity|v3ExchangeRatesError') : null;

  useEffect(() => {
    if (isExist(tezos) && isExist(poolId)) {
      void getLiquidityV3ItemWithPositions();
    }
  }, [getLiquidityV3ItemWithPositions, poolId, tezos]);

  const { positionsWithStats, loading: isLoading, error } = usePositionsWithStats();
  const positionsViewModel = useMemo(() => {
    if (!isExist(poolId) || !isExist(tokenX) || !isExist(tokenY)) {
      return [];
    }

    return positionsWithStats.map(mapPositionViewModel(tokenX, tokenY, poolId, isExchangeRatesError));
  }, [positionsWithStats, tokenX, tokenY, poolId, isExchangeRatesError]);

  return { isLoading, positionsViewModel, error, warningAlertMessage };
};
