import { useMigrateLiquidity, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useTranslation } from '@translation';

export const useDexTwoItemViewModel = () => {
  const { t } = useTranslation();
  const liquidityItemStore = useLiquidityItemStore();
  const migrateLiquidity = useMigrateLiquidity();

  return {
    t,
    title: liquidityItemStore.pageTitle,
    migrateLiquidity
  };
};
