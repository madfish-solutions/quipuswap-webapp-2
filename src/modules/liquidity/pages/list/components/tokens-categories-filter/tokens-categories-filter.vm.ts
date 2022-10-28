import { useTranslation } from '@translation';

import { useLiquidityListFiltersStore } from '../../../../hooks';

export const useTokensCategoriesFilter = () => {
  const { t } = useTranslation();
  const liquidityListFiltersStore = useLiquidityListFiltersStore();

  const { showStable, showBridged, showQuipu, showTezotopia, showBTC, showDexTwo } = liquidityListFiltersStore;

  const toggleShowStable = () => {
    return liquidityListFiltersStore.setShowStable(!showStable);
  };
  const toggleShowBridged = () => {
    return liquidityListFiltersStore.setShowBridged(!showBridged);
  };
  const toggleShowQuipu = () => {
    return liquidityListFiltersStore.setShowQuipu(!showQuipu);
  };
  const toggleShowTezotopia = () => {
    return liquidityListFiltersStore.setShowTezotopia(!showTezotopia);
  };
  const toggleShowBTC = () => {
    return liquidityListFiltersStore.setShowBTC(!showBTC);
  };
  const toggleShowDexTwo = () => {
    return liquidityListFiltersStore.setShowDexTwo(!showDexTwo);
  };

  const translation = {
    investedOnly: t('newLiquidity|investedOnly'),
    tooltipStableSwap: t('newLiquidity|tooltipStableSwap'),
    tooltipBridge: t('newLiquidity|tooltipBridge'),
    tooltipQuipu: t('newLiquidity|tooltipQuipu'),
    tooltipTezotopia: t('newLiquidity|tooltipTezotopia'),
    tooltipBTC: t('newLiquidity|tooltipBTC'),
    tooltipDexTwo: t('newLiquidity|tooltipDexTwo')
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
    toggleShowDexTwo,
    translation
  };
};
