import { useMigrateLiquidity } from '../../hooks';

export const useDexTwoAddLiqViewModel = () => {
  const { canMigrateLiquidity, onMigrateLiquidity } = useMigrateLiquidity();

  return { canMigrateLiquidity, onMigrateLiquidity };
};
