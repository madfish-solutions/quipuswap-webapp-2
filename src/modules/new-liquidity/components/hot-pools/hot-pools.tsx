import { FC } from 'react';

import { HotPoolInterface } from '@modules/new-liquidity/interfaces';

import { HotPoolCard } from '../hot-pool-card';
import { HotPoolSlider } from '../hot-pool-slider';

interface Props {
  pools: Array<HotPoolInterface>;
}

export const HotPools: FC<Props> = ({ pools }) => {
  return (
    <HotPoolSlider>
      {pools.map(({ id, tvl, apr, tokensInfo }) => (
        <HotPoolCard key={id} tvl={tvl} apr={apr} tokens={tokensInfo} />
      ))}
    </HotPoolSlider>
  );
};
