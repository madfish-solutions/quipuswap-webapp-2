import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { getNetworkFee } from '@shared/helpers';
import { Undefined } from '@shared/types';

export const useCoinflipRulesViewModel = () => {
  const { tezos } = useRootStore();

  const [networkFee, setNetworkFee] = useState<Undefined<BigNumber>>();

  useEffect(() => {
    (async () => {
      setNetworkFee(await getNetworkFee(tezos));
    })();
  }, [tezos]);

  return { networkFee };
};
