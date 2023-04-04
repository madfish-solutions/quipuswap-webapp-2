import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { DEFAULT_DECIMALS } from '@config/constants';
import { getLiquidityBakerRewardsApi } from '@modules/liquidity/api';
import { isNull, toReal } from '@shared/helpers';
import { useAuthStore, useOnBlock } from '@shared/hooks';
import { Nullable } from '@shared/types';

import { useLiquidityItemStore } from '../store';

export const useLiquidityBakerRewards = () => {
  const { accountPkh } = useAuthStore();
  const { item } = useLiquidityItemStore();
  const [rewards, setRewards] = useState<Nullable<BigNumber>>(null);

  const getRewards = useCallback(async () => {
    if (isNull(item) || isNull(accountPkh)) {
      return;
    }

    const poolId = item.id.toString();

    const { allRewards, frozenRewards, claimedRewards } = await getLiquidityBakerRewardsApi(accountPkh, poolId);

    const bigNumberRewards = toReal(
      new BigNumber(allRewards).minus(frozenRewards).minus(claimedRewards),
      DEFAULT_DECIMALS
    );

    setRewards(bigNumberRewards);
  }, [accountPkh, item]);

  useEffect(() => {
    void getRewards();
  }, [getRewards]);

  useOnBlock(getRewards);

  return { bakerRewards: rewards };
};
