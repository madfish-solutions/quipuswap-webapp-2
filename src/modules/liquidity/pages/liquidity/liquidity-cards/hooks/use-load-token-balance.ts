import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { getUserBalance } from '@blockchain';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { toReal } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

export const useLoadTokenBalance = (token: Nullable<Token>) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [realTokenBalance, setRealTokenBalance] = useState<Nullable<BigNumber>>(null);

  const getTokenBalance = useCallback(
    async (_token: Nullable<Token>) => {
      if (!tezos || !accountPkh || !_token) {
        return;
      }

      const { contractAddress, type, fa2TokenId } = _token;

      const userTokenABalance = await getUserBalance(tezos, accountPkh, contractAddress, type, fa2TokenId);

      if (userTokenABalance) {
        setRealTokenBalance(toReal(userTokenABalance, _token));
      }

      return userTokenABalance;
    },
    [accountPkh, tezos]
  );

  const clearBalance = useCallback(() => setRealTokenBalance(null), []);

  useEffect(() => {
    void getTokenBalance(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tezos, accountPkh, token]);

  return { tokenBalance: realTokenBalance, updateTokenBalance: getTokenBalance, clearBalance };
};
