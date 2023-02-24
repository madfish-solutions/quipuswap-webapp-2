import { useCallback } from 'react';

import { useLiquidityListFiltersStore } from '@modules/liquidity/hooks';
import { getTokenSymbol } from '@shared/helpers';
import { useAmplitudeService } from '@shared/hooks';
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { useTranslation } from '@translation';

export const useTokensFilterViewModel = () => {
  const { t } = useTranslation();
  const { chooseTokens } = useChooseTokens();
  const liquidityListFiltersStore = useLiquidityListFiltersStore();
  const { tokens } = liquidityListFiltersStore;
  const { log } = useAmplitudeService();

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

    log('LIQUIDITY_TOKENS_SELECTED', { tokens: chosenTokens?.map(token => getTokenSymbol(token)) });
    liquidityListFiltersStore.setTokens(chosenTokens);
  }, [chooseTokens, liquidityListFiltersStore, tokens, t, log]);

  return {
    tokens,
    handleSelectTokensClick
  };
};
