import { FC } from 'react';

import { useTezos } from '@providers/use-dapp';
import { useOnBlock, useTokensBalancesStore } from '@shared/hooks';

export const UserBalancesSubscription: FC = () => {
  const tezos = useTezos();
  const tokensBalancesStore = useTokensBalancesStore();

  useOnBlock(tezos, async () => tokensBalancesStore.loadBalances());

  return null;
};
