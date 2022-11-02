import { useCallback } from 'react';

import useSWR from 'swr';

import { makeBaker } from '@modules/farming/pages/item/helpers';
import { useBucketContract } from '@modules/liquidity/hooks';
import { useBakers } from '@providers/dapp-bakers';
import { isExist } from '@shared/helpers';

interface BucketContractStorage {
  previous_delegated: string;
  current_delegated: string;
  next_candidate: string;
}

export const useDexTwoPoolBaker = () => {
  const { data: bakers, loading: bakersLoading } = useBakers();
  const { bucketContract } = useBucketContract();

  const getDexTwoPoolBakerAddress = useCallback(async () => {
    if (!isExist(bucketContract)) {
      return null;
    }

    const bucketStorage = await bucketContract.storage<BucketContractStorage>();

    return bucketStorage.current_delegated;
  }, [bucketContract]);

  const { data: bakerAddress, isValidating: bakerAddressLoading } = useSWR(
    ['dex-two-pool-baker-address', bucketContract?.address],
    getDexTwoPoolBakerAddress
  );

  return { baker: makeBaker(bakerAddress, bakers), bakerIsLoading: bakersLoading || bakerAddressLoading };
};
