import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { DEFAULT_TOKEN_DECIMALS_PRECISION } from '@config/tokens';
import { useCoinflipStore } from '@modules/coinflip/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { getNetworkFee } from '@shared/helpers';
import { Undefined } from '@shared/types';

export const useCoinflipRulesViewModel = () => {
  const { tezos } = useRootStore();
  const { bidSize: contractBidSize, token } = useCoinflipStore();

  const [networkFee, setNetworkFee] = useState<Undefined<BigNumber>>();

  const { symbol: tokenSymbol } = token.metadata;
  const bidSize =
    Math.floor(Number(contractBidSize) * DEFAULT_TOKEN_DECIMALS_PRECISION) / DEFAULT_TOKEN_DECIMALS_PRECISION;

  const dataExists = bidSize && networkFee;

  useEffect(() => {
    (async () => {
      setNetworkFee(await getNetworkFee(tezos));
    })();
  }, [tezos]);

  return { tokenSymbol, bidSize, networkFee, dataExists };
};
