import { useCallback, useState } from 'react';

import { TEZOS_TOKEN } from '@config/tokens';
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { Token } from '@shared/types';

export const useTokensFilterViewModel = () => {
  const { chooseTokens } = useChooseTokens();

  const [tokens, setTokens] = useState<Nullable<Array<Token>>>(null);

  const handleSelectTokensClick = useCallback(async () => {
    const chosenTokens = await chooseTokens({
      tokens,
      disabledTokens: [TEZOS_TOKEN],
      min: 0,
      max: 4
    });

    setTokens(chosenTokens);
  }, [chooseTokens, tokens]);

  return {
    tokens,
    handleSelectTokensClick
  };
};
