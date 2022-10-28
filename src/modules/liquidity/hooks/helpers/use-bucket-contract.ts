import { useState, useEffect } from 'react';

import { getBucketContractApi } from '@modules/liquidity/api';
import { useRootStore } from '@providers/root-store-provider';
import { TaquitoContract } from '@shared/dapp';
import { isNull } from '@shared/helpers';

import { useLiquidityItemStore } from '../store';

export const useBucketContract = () => {
  const { item } = useLiquidityItemStore();
  const { tezos } = useRootStore();
  const [bucketContract, setBucketContract] = useState<Nullable<TaquitoContract>>(null);

  useEffect(() => {
    (async () => {
      if (isNull(item) || isNull(tezos)) {
        return;
      }

      const bContract = await getBucketContractApi(tezos, item.contractAddress, item.id);

      setBucketContract(bContract);
    })();
  }, [tezos, item, item?.contractAddress, item?.id]);

  return { bucketContract };
};
