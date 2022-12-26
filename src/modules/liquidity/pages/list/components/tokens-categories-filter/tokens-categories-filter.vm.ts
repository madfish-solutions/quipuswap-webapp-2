import { useTranslation } from '@translation';

import { useLiquidityListFiltersStore } from '../../../../hooks';

export const useTokensCategoriesFilter = () => {
  const { t } = useTranslation();
  const liquidityListFiltersStore = useLiquidityListFiltersStore();

  const { showStable, showBridged, showQuipu, showTezotopia, showBTC, showDexTwo, showV3 } = liquidityListFiltersStore;

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
  const toggleShowV3 = () => {
    return liquidityListFiltersStore.setShowV3(!showV3);
  };

  const translation = {
    investedOnly: t('liquidity|investedOnly'),
    tooltipStableSwap: t('liquidity|tooltipStableSwap'),
    tooltipBridge: t('liquidity|tooltipBridge'),
    tooltipQuipu: t('liquidity|tooltipQuipu'),
    tooltipTezotopia: t('liquidity|tooltipTezotopia'),
    tooltipBTC: t('liquidity|tooltipBTC'),
    tooltipDexTwo: t('liquidity|tooltipDexTwo'),
    tooltipV3: t('liquidity|tooltipV3')
  };

  return {
    showStable,
    showBridged,
    showQuipu,
    showTezotopia,
    showBTC,
    showDexTwo,
    showV3,
    toggleShowStable,
    toggleShowBridged,
    toggleShowQuipu,
    toggleShowTezotopia,
    toggleShowBTC,
    toggleShowDexTwo,
    toggleShowV3,
    translation
  };
};
