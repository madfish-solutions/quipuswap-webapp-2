import { Dispatch, SetStateAction } from 'react';

import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { TokenNumber, handleTokenChange } from '@shared/helpers/handle-token-change';
import { useExchangeRates } from '@shared/hooks/use-exchange-rate';
import { TokenDataMap, Token } from '@shared/types';

export const useHandleTokenChange = (setTokensData: Dispatch<SetStateAction<TokenDataMap>>) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();

  return async (token: Token, tokenNumber: TokenNumber) => {
    if (!tezos || !accountPkh) {
      return;
    }
    await handleTokenChange({
      token,
      tokenNumber,
      // @ts-ignore
      exchangeRates,
      tezos,
      accountPkh,
      setTokensData
    });
  };
};
