import { useCallback, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import useSWR from 'swr';

import { useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useBakers } from '@providers/dapp-bakers';
import { useTezos } from '@providers/use-dapp';
import { getStorageInfo } from '@shared/dapp';
import { defined, isExist } from '@shared/helpers';
import { Optional } from '@shared/types';

import { BucketStorage, DexTwoContractStorage } from './storage.types';

export const useDexTwoPoolBaker = () => {
  const { data: bakers, loading: bakersLoading } = useBakers();
  const liquidityItemStore = useLiquidityItemStore();
  const tezos = useTezos();
  const poolAddress = liquidityItemStore.item?.contractAddress;
  const poolId = liquidityItemStore.item?.id;

  const getDexTwoPoolBakerAddress = useCallback(
    async (_: string, dexTwoPoolAddress: Optional<string>, dexTwoPoolId: Optional<BigNumber>) => {
      if (!isExist(dexTwoPoolAddress) || !isExist(tezos) || !isExist(dexTwoPoolId)) {
        return null;
      }

      const { storage: dexTwoPoolStorage } = await getStorageInfo<DexTwoContractStorage>(tezos, dexTwoPoolAddress);
      const pair = defined(await dexTwoPoolStorage.pairs.get(dexTwoPoolId), 'Pair was not found in storage');
      const bucketStorage = await getStorageInfo<BucketStorage>(tezos, pair.bucket);

      return bucketStorage.current_delegated;
    },
    [tezos]
  );

  const { data: dexTwoPoolBakerAddress, isValidating: dexTwoPoolBakerAddressLoading } = useSWR(
    ['dex-two-pool-baker-address', poolAddress, poolId],
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
