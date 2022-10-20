import { useNewLiquidityListStore } from '../../../../hooks';

export const useTokensCategoriesFilter = () => {
  const newLiquidityListStore = useNewLiquidityListStore();

  const { showStable, showBridged, showQuipu, showTezotopia, showBTC, showDexTwo } = newLiquidityListStore;

  const toggleShowStable = () => {
    return newLiquidityListStore.setShowStable(!showStable);
  };
  const toggleShowBridged = () => {
    return newLiquidityListStore.setShowBridged(!showBridged);
  };
  const toggleShowQuipu = () => {
    return newLiquidityListStore.setShowQuipu(!showQuipu);
  };
  const toggleShowTezotopia = () => {
    return newLiquidityListStore.setShowTezotopia(!showTezotopia);
  };
  const toggleShowBTC = () => {
    return newLiquidityListStore.setShowBTC(!showBTC);
  };
  const toggleShowDexTwo = () => {
    return newLiquidityListStore.setShowDexTwo(!showDexTwo);
  };

  return {
    showStable,
    showBridged,
    showQuipu,
    showTezotopia,
    showBTC,
    showDexTwo,
    toggleShowStable,
    toggleShowBridged,
    toggleShowQuipu,
    toggleShowTezotopia,
    toggleShowBTC,
    toggleShowDexTwo
  };
};
