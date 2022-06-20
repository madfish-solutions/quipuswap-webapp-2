import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { DEFAULT_TOKEN } from '@config/tokens';
import { useRootStore } from '@providers/root-store-provider';
import { fromDecimals, isNull } from '@shared/helpers';
import { useAuthStore, useOnBlock } from '@shared/hooks';

import { getStableFarmStakerBalanceApi } from '../../api';
import { useStableFarmItemStore } from '../../hooks';

export const useStableFarmStakerBalance = () => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const stableFarmItemStore = useStableFarmItemStore();

  const { item } = stableFarmItemStore;

  const [balance, setBalance] = useState<Nullable<BigNumber>>(null);

  const updateStakerBalance = useCallback(async () => {
    if (isNull(tezos) || !accountPkh || isNull(item)) {
      return;
    }
    const { contractAddress } = item;

    const stakerBalanceAtomic = await getStableFarmStakerBalanceApi(tezos, contractAddress, accountPkh);
    const stakerBalance = fromDecimals(stakerBalanceAtomic, DEFAULT_TOKEN);

    setBalance(stakerBalance);
  }, [accountPkh, item, tezos]);

  useEffect(() => {
    updateStakerBalance();
  }, [updateStakerBalance]);

  useOnBlock(tezos, updateStakerBalance);

  return balance;
};
