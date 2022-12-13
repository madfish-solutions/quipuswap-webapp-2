import { useEffect, useMemo } from 'react';

import cx from 'classnames';

import {
  useGetLiquidityV3ItemWithPositions,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import { ColorModes } from '@providers/color-theme-context';
import { useRootStore } from '@providers/root-store-provider';
import { isExist } from '@shared/helpers';
import { useUiStore } from '@shared/hooks';

import { mapPositionViewModel } from './helpers/map-position-view-model';
import { usePositionsWithStats } from './hooks/use-positions-with-stats';
import styles from './v3-positions-page.module.scss';

const rangeLabelClasses = {
  [ColorModes.Light]: cx(styles.light, styles.rangeLabel),
  [ColorModes.Dark]: cx(styles.dark, styles.rangeLabel)
};

export const useV3PositionsViewModel = () => {
  const { colorThemeMode } = useUiStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { tezos } = useRootStore();
  const { getLiquidityV3ItemWithPositions } = useGetLiquidityV3ItemWithPositions();

  const poolId = v3PositionsStore.poolId;

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

    return positionsWithStats.map(
      mapPositionViewModel(
        {
          className: rangeLabelClasses[colorThemeMode],
          inRangeClassName: styles.inRangeLabel
        },
        tokenX,
        tokenY,
        poolId
      )
    );
  }, [colorThemeMode, positionsWithStats, tokenX, tokenY, poolId]);

  return { isLoading, positionsViewModel, error };
};
