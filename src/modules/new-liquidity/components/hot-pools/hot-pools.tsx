import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Token } from '@shared/types';

import { HotPoolCard } from '../hot-pool-card';
import { HotPoolSlider } from '../hot-pool-slider';

interface Item {
  id: BigNumber;
  tvlInUsd: BigNumber;
  maxApr: Nullable<number>;
  inputToken: Array<Token>;
}
interface Props {
  pools: Array<Item>;
}

export const HotPools: FC<Props> = ({ pools }) => {
  return (
    <HotPoolSlider>
      {pools.map(({ id, tvlInUsd, maxApr, inputToken }) => (
        <HotPoolCard key={id.toString()} tvl={tvlInUsd} apr={maxApr} tokens={inputToken} />
      ))}
    </HotPoolSlider>
  );
};
