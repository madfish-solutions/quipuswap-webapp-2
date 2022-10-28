import { useCallback } from 'react';

import { TEZOS_TOKEN } from '@config/tokens';
import { useLiquidityListFiltersStore } from '@modules/liquidity/hooks';
import { useChooseTokens } from '@shared/modals/tokens-modal';

export const useTokensFilterViewModel = () => {
  const { chooseTokens } = useChooseTokens();
  const liquidityListFiltersStore = useLiquidityListFiltersStore();
  const { tokens } = liquidityListFiltersStore;

  const handleSelectTokensClick = useCallback(async () => {
    const chosenTokens = await chooseTokens({
      tokens,
      disabledTokens: [TEZOS_TOKEN],
      min: 0,
      max: 4
    });

    liquidityListFiltersStore.setTokens(chosenTokens);
  }, [chooseTokens, liquidityListFiltersStore, tokens]);

  return {
    tokens,
    handleSelectTokensClick
  };
};
