import { FC } from 'react';

import { HotPoolCard } from '../hot-pool-card';
import { HotPoolSlider } from '../hot-pool-slider';
import { HotPoolsData } from './hot-pools-data';

export const HotPools: FC = () => {
  return (
    <HotPoolSlider>
      {HotPoolsData.map(({ id, tvl, apr, tokens }) => (
        <HotPoolCard key={id} tvl={tvl} apr={apr} tokens={tokens} />
      ))}
    </HotPoolSlider>
  );
};
