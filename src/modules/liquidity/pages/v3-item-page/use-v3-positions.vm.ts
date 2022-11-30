import { useEffect, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE } from '@config/constants';
import {
  useLiquidityV3ItemStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import {
  CURRENT_PRICE_STAT_INDEX,
  useLiquidityV3PoolStats
} from '@modules/liquidity/hooks/helpers/use-liquidity-v3-pool-stats';
import { defined, isExist, isNull } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';

import { mapPosition } from './helpers';

export const useV3PositionsViewModel = () => {
  const { id } = useParams();
  const v3ItemStore = useLiquidityV3ItemStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { stats } = useLiquidityV3PoolStats();

  const item = v3ItemStore.item;
  const rawPositions = v3PositionsStore.positions;

  useEffect(() => {
    v3PositionsStore.setPoolId(new BigNumber(defined(id, 'id')));
    void v3PositionsStore.positionsStore.load();
  }, [v3PositionsStore, id]);

  const isLoading =
    v3ItemStore.itemIsLoading || v3PositionsStore.positionsAreLoading || isNull(tokenX) || isNull(tokenY);
  const error = v3ItemStore.error ?? v3PositionsStore.positionsStore.error;

  const tokenXExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenX) ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE;
  const tokenYExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenY) ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE;

  const currentPrice = stats[CURRENT_PRICE_STAT_INDEX].amount;

  const positions = useMemo(() => {
    if (isNull(item) || isNull(rawPositions) || isNull(tokenX) || isNull(tokenY)) {
      return [];
    }

    return rawPositions.map(mapPosition(tokenX, tokenY, currentPrice, tokenXExchangeRate, tokenYExchangeRate, id));
  }, [item, rawPositions, tokenX, tokenY, currentPrice, tokenXExchangeRate, tokenYExchangeRate, id]);

  return { isLoading, positions, stats, error };
};
