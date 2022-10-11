import { useState, useEffect, useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { getContract } from '@shared/dapp';
import { isNull } from '@shared/helpers';
import { useAuthStore, useOnBlock } from '@shared/hooks';

type Contract = Awaited<ReturnType<typeof getContract>>;

export const useNewLiquidityRewards = () => {
  const { accountPkh } = useAuthStore();
  const { item } = useNewLiquidityItemStore();
  const { tezos } = useRootStore();
  const [bucketContract, setBucketContract] = useState<Nullable<Contract>>(null);
  const [rewards, setRewards] = useState<Nullable<BigNumber>>(null);

  useEffect(() => {
    (async () => {
      if (isNull(item) || isNull(tezos)) {
        return;
      }

      const localContract = await getContract(tezos, item.contractAddress);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storage = await localContract.storage<any>();

      const pairValue = await storage.storage.pairs.get(Number(item.id));

      const bContract = await getContract(tezos, pairValue.bucket);

      setBucketContract(bContract);
    })();
  }, [tezos, item, item?.contractAddress]);

  const getRewards = useCallback(async () => {
    if (isNull(bucketContract) || isNull(item) || isNull(tezos) || isNull(accountPkh)) {
      return;
    }

    const bigNumberRewards = await bucketContract.contractViews
      .get_user_reward(accountPkh)
      .executeView({ viewCaller: accountPkh });

    setRewards(bigNumberRewards);
  }, [accountPkh, bucketContract, item, tezos]);

  useOnBlock(getRewards);

  return { rewards };
};
