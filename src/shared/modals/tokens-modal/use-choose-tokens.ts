import { useCallback } from 'react';

import { Token } from '@shared/types';

import { useTokensModalStore } from './use-tokens-modal-store';

export const useChooseTokens = () => {
  const tokensModalStore = useTokensModalStore();

  const chooseTokens = useCallback(async () => {
    tokensModalStore.setOpenState(true);

    return new Promise<Array<Token>>(resolve => {
      tokensModalStore.setTokensResolver(resolve);
    });
  }, [tokensModalStore]);

  return { chooseTokens };
};
