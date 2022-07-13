import { useCallback } from 'react';

import { TokensModalInitialParams } from './types';
import { useTokensModalStore } from './use-tokens-modal-store';

export const useChooseTokens = () => {
  const tokensModalStore = useTokensModalStore();

  const chooseTokens = useCallback(
    async (params: TokensModalInitialParams) => await tokensModalStore.open(params),
    [tokensModalStore]
  );

  return { chooseTokens };
};
