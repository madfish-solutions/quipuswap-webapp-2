import { FC } from 'react';

import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { useOnBlock, useTokensBalancesStore } from '@shared/hooks';

import { getUserTokenBalance } from './get-user-balance';

export const UserBalancesSubscription: FC = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const tokensBalancesStore = useTokensBalancesStore();

  const loadBalances = async () => {
    if (!tezos || !accountPkh) {
      tokensBalancesStore.clearBalances();

      return null;
    }

    return await Promise.all(
      tokensBalancesStore.tokensBalances.map(async ({ token }) => {
        const balance = await getUserTokenBalance(tezos, accountPkh, token);
        tokensBalancesStore.setBalance(token, balance);
      })
    );
  };

  useOnBlock(tezos, loadBalances);

  return null;
};
