import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useAccountPkh, useTezos } from '@utils/dapp';
import { Nullable } from '@utils/types';

export const useClaimRewards = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  return useCallback(
    async (farmId: Nullable<BigNumber>) => {
      if (!tezos || !farmId || !accountPkh) {
        return;
      }

      // eslint-disable-next-line no-console
      console.log('TODO: claim rewards from staking');
    },
    [tezos, accountPkh]
  );
};
