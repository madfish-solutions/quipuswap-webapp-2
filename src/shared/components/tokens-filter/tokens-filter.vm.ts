import { useCallback } from 'react';

import { useLiquidityListFiltersStore } from '@modules/liquidity/hooks';
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { useTranslation } from '@translation';

export const useTokensFilterViewModel = () => {
  const { t } = useTranslation();
  const { chooseTokens } = useChooseTokens();
  const liquidityListFiltersStore = useLiquidityListFiltersStore();
  const { tokens } = liquidityListFiltersStore;

  const handleSelectTokensClick = useCallback(async () => {
    const chosenTokens = await chooseTokens({
      tokens,
      disabledTokens: [],
      min: 0,
      max: 4,
      cancelButtonProps: {
        children: t('common|cancel'),
        theme: 'secondary'
      },
      confirmButtonProps: {
        children: t('common|applyFilter')
      }
    });

    liquidityListFiltersStore.setTokens(chosenTokens);
  }, [chooseTokens, liquidityListFiltersStore, tokens, t]);

  return {
    tokens,
    handleSelectTokensClick
  };
};
