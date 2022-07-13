import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

import { getPoolCreationCostApi } from '../api';

export const usePoolCreationPrice = () => {
  const [creationPrice, setCreationPrice] = useState<Nullable<BigNumber>>(null);

  const { tezos } = useRootStore();

  useEffect(() => {
    if (isNull(tezos)) {
      return;
    }
    getPoolCreationCostApi(tezos).then(setCreationPrice);
  }, [tezos]);

  return { creationPrice };
};
