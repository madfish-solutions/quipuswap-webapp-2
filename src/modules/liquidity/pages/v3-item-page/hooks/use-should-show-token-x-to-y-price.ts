import { useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';

export const useShouldShowTokenXToYPrice = () => {
  const settingsStore = useSettingsStore();
  const { poolId } = useLiquidityV3PoolStore();

  return (poolId && settingsStore.v3PoolsTokensOrder[poolId.toNumber()]) ?? false;
};
