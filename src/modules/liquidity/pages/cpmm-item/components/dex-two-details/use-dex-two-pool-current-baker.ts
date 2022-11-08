import { useCallback } from 'react';

import useSWR from 'swr';

import { makeBaker } from '@modules/farming/pages/item/helpers';
import { BlockchainDexTwoLiquidityApi } from '@modules/liquidity/api';
import { useBucketContract, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useBakers } from '@providers/dapp-bakers';
import { isTezosToken } from '@shared/helpers';

export const useDexTwoPoolCurrentBaker = () => {
  const { item } = useLiquidityItemStore();
  const { data: bakers, loading: bakersLoading, error: bakersError } = useBakers();
  const { bucketContract } = useBucketContract();
  const canHaveBaker = item?.tokensInfo.some(({ token }) => isTezosToken(token));

  const getDexTwoPoolBakerAddress = useCallback(
    async () => await BlockchainDexTwoLiquidityApi.getBakerAddress(bucketContract),
    [bucketContract]
  );

  const {
    data: bakerAddress,
    isValidating: bakerAddressLoading,
    error: bakerAddressError
  } = useSWR(['dex-two-pool-baker-address', bucketContract?.address], getDexTwoPoolBakerAddress);

  const errorData = bakersError || bakerAddressError;
  const error = errorData ? new Error(errorData) : null;

  return {
    currentBaker: { data: makeBaker(bakerAddress, bakers), loading: bakersLoading || bakerAddressLoading, error },
    canHaveBaker
  };
};
