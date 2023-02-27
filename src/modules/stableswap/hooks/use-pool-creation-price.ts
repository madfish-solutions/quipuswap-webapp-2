import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { getRealPoolCreationCostApi } from '../api';
import { StableswapVersion } from '../types';

export const usePoolCreationPrice = (poolVersion: StableswapVersion) => {
  const [creationPrice, setCreationPrice] = useState<Nullable<BigNumber>>(null);

  const { tezos } = useRootStore();

  useEffect(() => {
    if (isNull(tezos)) {
      return;
    }
    getRealPoolCreationCostApi(tezos, poolVersion).then(setCreationPrice);
  }, [tezos, poolVersion]);

  return { creationPrice };
};
