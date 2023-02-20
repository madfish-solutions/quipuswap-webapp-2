import { useCallback } from 'react';

import { FIRST_INDEX } from '@config/constants';
import { useLiquidityV3ItemTokens, useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { getTokenSymbol, isExist } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';

import { useShouldShowTokenXToYPrice } from '../../hooks';

export const useTokensOrderSwitcherViewModel = () => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const settingsStore = useSettingsStore();
  const { poolId } = useLiquidityV3PoolStore();
  const shouldShowTokenXToYPrice = useShouldShowTokenXToYPrice();

  const handleButtonClick = useCallback(
    (index: number) => {
      settingsStore.updateV3PoolsTokensOrder(poolId!.toNumber(), index !== FIRST_INDEX);
    },
    [poolId, settingsStore]
  );

  if (!isExist(tokenX) || !isExist(tokenY) || !isExist(poolId)) {
    return {
      isHidden: true,
      labels: [],
      activeIndex: FIRST_INDEX,
      handleButtonClick
    };
  }

  return {
    isHidden: false,
    labels: [getTokenSymbol(tokenY), getTokenSymbol(tokenX)],
    activeIndex: Number(shouldShowTokenXToYPrice),
    handleButtonClick
  };
};
