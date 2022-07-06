import { useCallback } from 'react';

import { useTokensModalStore } from './use-tokens-modal-store';

export const useChooseTokens = () => {
  const tokensModalStore = useTokensModalStore();

  const chooseTokens = useCallback(async () => await tokensModalStore.open(), [tokensModalStore]);

  return { chooseTokens };
};
