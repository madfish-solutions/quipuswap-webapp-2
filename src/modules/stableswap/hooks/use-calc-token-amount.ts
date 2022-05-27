import { useCallback } from 'react';

import { MichelsonMap } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { getContract } from '@shared/dapp';
import { defined } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';

import { useStableswapItemStore } from './store';

export const useCalcTokenAmountView = (isDeposit: boolean) => {
  const { item } = useStableswapItemStore();
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();

  const calcTokenAmountView = useCallback(
    async (amounts: MichelsonMap<BigNumber, BigNumber>) => {
      try {
        const contract = await getContract(defined(tezos), defined(item).contractAddress);

        return await contract.contractViews
          .calc_token_amount({
            pool_id: defined(item).id,
            amounts: amounts,
            is_deposit: isDeposit
          })
          .executeView({ viewCaller: defined(accountPkh) });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        //TODO: check what to return
        return new BigNumber('0');
      }
    },
    [tezos, item, isDeposit, accountPkh]
  );

  return { calcTokenAmountView };
};
