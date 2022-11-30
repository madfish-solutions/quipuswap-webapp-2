import { useEffect, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useParams } from 'react-router-dom';

import {
  useLiquidityV3ItemStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import {
  CURRENT_PRICE_STAT_INDEX,
  useLiquidityV3PoolStats
} from '@modules/liquidity/hooks/helpers/use-liquidity-v3-pool-stats';
import { ColorModes } from '@providers/color-theme-context';
import { defined, isNull } from '@shared/helpers';
import { useTokenExchangeRate, useUiStore } from '@shared/hooks';

import { mapPosition } from './helpers';
import styles from './v3-positions-page.module.scss';

const rangeLabelClasses = {
  [ColorModes.Light]: cx(styles.light, styles.rangeLabel),
  [ColorModes.Dark]: cx(styles.dark, styles.rangeLabel)
};

export const useV3PositionsViewModel = () => {
  const { colorThemeMode } = useUiStore();
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

  const currentPrice = stats[CURRENT_PRICE_STAT_INDEX].amount;

  const positions = useMemo(() => {
    if (isNull(item) || isNull(rawPositions) || isNull(tokenX) || isNull(tokenY)) {
      return [];
    }

    return rawPositions.map(
      mapPosition(tokenX, tokenY, currentPrice, getTokenExchangeRate, id, {
        className: rangeLabelClasses[colorThemeMode],
        inRangeClassName: styles.inRangeLabel
      })
    );
  }, [item, rawPositions, tokenX, tokenY, currentPrice, getTokenExchangeRate, id, colorThemeMode]);

  return { isLoading, positions, stats, error };
};
