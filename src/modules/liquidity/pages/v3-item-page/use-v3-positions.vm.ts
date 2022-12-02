import { useEffect, useMemo } from 'react';

import cx from 'classnames';

import { useLiquidityV3PositionsStore } from '@modules/liquidity/hooks';
import { ColorModes } from '@providers/color-theme-context';
import { useUiStore } from '@shared/hooks';

import { mapPositionStats } from './helpers/map-position-stats';
import { usePositionsStats } from './hooks/use-positions-stats';
import styles from './v3-positions-page.module.scss';

const rangeLabelClasses = {
  [ColorModes.Light]: cx(styles.light, styles.rangeLabel),
  [ColorModes.Dark]: cx(styles.dark, styles.rangeLabel)
};

export const useV3PositionsViewModel = () => {
  const { colorThemeMode } = useUiStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();

  const id = v3PositionsStore.poolId?.toFixed();

  useEffect(() => {
    void v3PositionsStore.positionsStore.load();
  }, [v3PositionsStore, id]);

  const { stats, loading: isLoading, error } = usePositionsStats();
  const positions = useMemo(
    () =>
      stats.map(
        mapPositionStats({
          className: rangeLabelClasses[colorThemeMode],
          inRangeClassName: styles.inRangeLabel
        })
      ),
    [colorThemeMode, stats]
  );

  return { isLoading, positions, error };
};
