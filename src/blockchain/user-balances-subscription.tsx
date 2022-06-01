import { FC, useEffect } from 'react';

import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { useOnBlock, useTokensBalancesStore } from '@shared/hooks';

export const UserBalancesSubscription: FC = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const tokensBalancesStore = useTokensBalancesStore();

  useOnBlock(tezos, async () => tokensBalancesStore.loadBalances());

  useEffect(() => {
    if (accountPkh) {
      tokensBalancesStore.loadBalances();
    } else {
      tokensBalancesStore.clearBalances();
    }
  }, [accountPkh, tokensBalancesStore]);

  return null;
};
