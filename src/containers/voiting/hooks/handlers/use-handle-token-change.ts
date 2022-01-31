import { Dispatch, SetStateAction } from 'react';

import { useExchangeRates } from '@hooks/useExchangeRate';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { handleTokenChange, TokenNumber } from '@utils/helpers';
import { TokenDataMap, WhitelistedToken } from '@utils/types';

export const useHandleTokenChange = (setTokensData: Dispatch<SetStateAction<TokenDataMap>>) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();

  return async (token: WhitelistedToken, tokenNumber: TokenNumber) => {
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
