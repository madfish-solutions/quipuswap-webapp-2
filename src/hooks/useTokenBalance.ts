import { useEffect, useState, useCallback } from 'react';

import {
  getUserBalance, useAccountPkh, useOnBlock, useTezos,
} from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

import { useExchangeRates } from './useExchangeRate';

export const useTokenBalance = (token:WhitelistedToken) => {
  const exchangeRates = useExchangeRates();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const [balance, setBalance] = useState<string>('0');
  const loadBalance = useCallback(async () => {
    let finalBalance = '0';
    if (!exchangeRates || !exchangeRates.find) return;
    if (tezos && accountPkh) {
      try {
        const userBalance = await getUserBalance(
          tezos,
          accountPkh,
          token.contractAddress,
          token.type,
          token.fa2TokenId,
        );
        if (userBalance) {
          finalBalance = fromDecimals(userBalance, token.metadata.decimals).toString();
        }
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
    setBalance(finalBalance);
  }, [exchangeRates, tezos, accountPkh, token]);
  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  useOnBlock(tezos, loadBalance);

  return balance;
};
