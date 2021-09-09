import React from 'react';

import { TopAssets } from '@components/home/TopAssets';

import { TopFarmingsData } from './content';

type TopFarmingsProps = {
  className?: string
};

export const TopFarmings: React.FC<TopFarmingsProps> = ({
  className,
}) => (
  <TopAssets
    header="Top Farming pools"
    description="The most popular Farming pools by APR"
    data={TopFarmingsData}
    button={{
      href: '/farmings',
      label: 'View All Farms',
    }}
    className={className}
    isFarm
  />
);
