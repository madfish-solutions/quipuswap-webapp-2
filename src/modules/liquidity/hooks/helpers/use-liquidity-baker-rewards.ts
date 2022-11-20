import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { getLiquidityBakerRewardsApi } from '@modules/liquidity/api';
import { useRootStore } from '@providers/root-store-provider';
import { TaquitoContract } from '@shared/dapp';
import { isNull } from '@shared/helpers';
import { useAuthStore, useOnBlock } from '@shared/hooks';
import { Nullable } from '@shared/types';

import { useLiquidityItemStore } from '../store';

interface UseLiquidityBakerRewardsParams {
  bucketContract: Nullable<TaquitoContract>;
}

export const useLiquidityBakerRewards = ({ bucketContract }: UseLiquidityBakerRewardsParams) => {
  const { accountPkh } = useAuthStore();
  const { item } = useLiquidityItemStore();
  const { tezos } = useRootStore();
  const [rewards, setRewards] = useState<Nullable<BigNumber>>(null);

  const getRewards = useCallback(async () => {
    if (isNull(bucketContract) || isNull(item) || isNull(tezos) || isNull(accountPkh)) {
      return;
    }

    const bigNumberRewards = await getLiquidityBakerRewardsApi(bucketContract, accountPkh);

    setRewards(bigNumberRewards);
  }, [accountPkh, bucketContract, item, tezos]);

  useEffect(() => {
    void getRewards();
  }, [getRewards]);

  useOnBlock(getRewards);

  return { bakerRewards: rewards };
};
