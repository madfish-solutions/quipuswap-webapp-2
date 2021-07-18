import React from 'react';

import { TopAssets } from '@components/home/TopAssets';

import { TopPairsData } from './content';

type TopPairsProps = {
  className?: string
};

export const TopPairs: React.FC<TopPairsProps> = ({
  className,
}) => (
  <TopAssets
    header="Top Pairs"
    description="The most popular Trading Pairs by trading volume"
    data={TopPairsData}
    button={{
      href: 'https://analytics.quipuswap.com/pairs',
      label: 'View All Pairs',
      external: true,
    }}
    className={className}
  />
);
