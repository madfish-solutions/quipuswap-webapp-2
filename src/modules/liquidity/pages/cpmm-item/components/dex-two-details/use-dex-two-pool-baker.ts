import { useCallback, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import useSWR from 'swr';

import { useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useBakers } from '@providers/dapp-bakers';
import { useTezos } from '@providers/use-dapp';
import { getStorageInfo } from '@shared/dapp';
import { isExist } from '@shared/helpers';
import { Optional } from '@shared/types';

import { BucketContractStorage, DexTwoContractStorage } from './storages.types';

export const useDexTwoPoolBaker = () => {
  const { data: bakers, loading: bakersLoading } = useBakers();
  const liquidityItemStore = useLiquidityItemStore();
  const tezos = useTezos();
  const dexTwoPool = liquidityItemStore?.item;

  const getDexTwoPoolBakerAddress = useCallback(
    async (_: string, dexTwoContractAddress: Optional<string>, dexTwoPoolId: Optional<BigNumber>) => {
      if (!isExist(dexTwoContractAddress) || !isExist(tezos) || !isExist(dexTwoPoolId)) {
        return null;
      }

      const { storage: dexTwoPoolStorage } = await getStorageInfo<DexTwoContractStorage>(tezos, dexTwoContractAddress);
      const pair = await dexTwoPoolStorage.pairs.get(dexTwoPoolId);
      const bucketAddress = pair?.bucket;

      if (!isExist(bucketAddress)) {
        return null;
      }

      const bucketStorage = await getStorageInfo<BucketContractStorage>(tezos, bucketAddress);

      return bucketStorage.current_delegated;
    },
    [tezos]
  );

  const { data: dexTwoPoolBakerAddress, isValidating: dexTwoPoolBakerAddressLoading } = useSWR(
    ['dex-two-pool-baker-address', dexTwoPool?.contractAddress, dexTwoPool?.id],
    getDexTwoPoolBakerAddress
  );

  const baker = useMemo(() => {
    if (isExist(dexTwoPoolBakerAddress)) {
      return (
        bakers.find(knownBaker => knownBaker.address === dexTwoPoolBakerAddress) ?? { address: dexTwoPoolBakerAddress }
      );
    }

    return null;
  }, [dexTwoPoolBakerAddress, bakers]);

  const bakerIsLoading = bakersLoading || dexTwoPoolBakerAddressLoading;

  return { baker, bakerIsLoading };
};
