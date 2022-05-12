import { FC } from 'react';

import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { useOnBlock, useTokensBalancesStore } from '@shared/hooks';

export const UserBalancesSubscription: FC = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const tokensBalancesStore = useTokensBalancesStore();

  useOnBlock(tezos, async () => tokensBalancesStore.loadBalances(tezos, accountPkh));

  return null;
};
