import { useLiquidityListFiltersStore } from '@modules/liquidity/hooks';
import { PoolTypeOptionEnum } from '@modules/liquidity/interfaces';

const labels = ['All', 'V1', 'V2', 'V3', 'Stableswap'];
const poolTypesOptions = [
  PoolTypeOptionEnum.ALL,
  PoolTypeOptionEnum.V1,
  PoolTypeOptionEnum.V2,
  PoolTypeOptionEnum.V3,
  PoolTypeOptionEnum.STABLESWAP
];

export const usePoolTypeFilterViewModel = () => {
  const filtersStore = useLiquidityListFiltersStore();

  const handlePoolTypeButtonClick = (poolTypeIndex: number) =>
    filtersStore.setPoolTypeOption(poolTypesOptions[poolTypeIndex]);
  const activePoolTypeIndex = poolTypesOptions.indexOf(filtersStore.poolTypeOption);

  return {
    labels,
    activePoolTypeIndex,
    handlePoolTypeButtonClick
  };
};
