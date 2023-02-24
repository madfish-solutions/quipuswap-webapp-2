import { useMemo } from 'react';

import { useLiquidityListFiltersStore } from '@modules/liquidity/hooks';
import { PoolTypeOptionEnum } from '@modules/liquidity/interfaces';
import { useTranslation } from '@translation';

export const usePoolTypeFilterViewModel = () => {
  const filtersStore = useLiquidityListFiltersStore();
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      { label: t('liquidity|allPoolTypes'), value: PoolTypeOptionEnum.ALL },
      { label: 'V1', value: PoolTypeOptionEnum.V1 },
      { label: 'V2', value: PoolTypeOptionEnum.V2 },
      { label: 'V3', value: PoolTypeOptionEnum.V3 },
      { label: t('common|Stableswap'), value: PoolTypeOptionEnum.STABLESWAP }
    ],
    [t]
  );
  const labels = useMemo(() => options.map(({ label }) => label), [options]);

  const handlePoolTypeButtonClick = (poolTypeIndex: number) =>
    filtersStore.setPoolTypeOption(options[poolTypeIndex].value);
  const activePoolTypeIndex = options.findIndex(({ value }) => value === filtersStore.poolTypeOption);

  return {
    labels,
    activePoolTypeIndex,
    handlePoolTypeButtonClick
  };
};
