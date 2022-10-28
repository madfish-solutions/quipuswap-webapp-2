import { useMigrateLiquidity, useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useTranslation } from '@translation';

export const useDexTwoItemViewModel = () => {
  const { t } = useTranslation();
  const newLiquidityItemStore = useNewLiquidityItemStore();
  const migrateLiquidity = useMigrateLiquidity();

  return {
    t,
    title: newLiquidityItemStore.pageTitle,
    migrateLiquidity
  };
};
