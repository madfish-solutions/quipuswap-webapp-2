import { useMigrateLiquidity, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useTranslation } from '@translation';

export const useDexTwoItemViewModel = () => {
  const { t } = useTranslation();
  const newLiquidityItemStore = useLiquidityItemStore();
  const migrateLiquidity = useMigrateLiquidity();

  return {
    t,
    title: newLiquidityItemStore.pageTitle,
    migrateLiquidity
  };
};
