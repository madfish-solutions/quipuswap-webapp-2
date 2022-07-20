import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { CONTRACT_DECIMALS_PRECISION, PRECISION_PERCENT } from '@config/constants';
import { useCoinflipStore } from '@modules/coinflip/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { getNetworkFee } from '@shared/helpers';
import { Undefined } from '@shared/types';

export const useCoinflipRulesViewModel = () => {
  const { tezos } = useRootStore();
  const { generalStats } = useCoinflipStore();
  const maxBetPercentFromContract = generalStats?.maxBetPercent;

  const [networkFee, setNetworkFee] = useState<Undefined<BigNumber>>();

  const maxBetPercent = maxBetPercentFromContract?.div(CONTRACT_DECIMALS_PRECISION).multipliedBy(PRECISION_PERCENT);
  const dataExists = maxBetPercent && networkFee;

  useEffect(() => {
    (async () => {
      setNetworkFee(await getNetworkFee(tezos));
    })();
  }, [tezos]);

  return { networkFee, maxBetPercent, dataExists };
};
