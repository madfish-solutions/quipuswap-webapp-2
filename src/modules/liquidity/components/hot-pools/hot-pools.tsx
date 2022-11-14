import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Nullable, Token } from '@shared/types';

import { HotPoolCard } from '../hot-pool-card';
import { HotPoolSlider } from '../hot-pool-slider';

interface Item {
  id: BigNumber;
  tvlInUsd: BigNumber;
  maxApr: Nullable<number>;
  inputToken: Array<Token>;
  href: string;
}
interface Props {
  pools: Array<Item>;
}

export const HotPools: FC<Props> = ({ pools }) => {
  return (
    <HotPoolSlider poolsCount={pools.length}>
      {pools.map(({ id, tvlInUsd, maxApr, inputToken, href }) => (
        <HotPoolCard key={id.toString()} tvl={tvlInUsd} apr={maxApr} tokens={inputToken} href={href} />
      ))}
    </HotPoolSlider>
  );
};
