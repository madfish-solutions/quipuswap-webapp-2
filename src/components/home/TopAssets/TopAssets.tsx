import React from 'react';

import { Section, SectionProps } from '@components/home/Section';
// import { FarmTable } from '@components/tables/FarmTable';

// import { PoolTable } from '@components/tables/PoolTable';

type TopAssetsProps = Omit<SectionProps, 'className'> & {
  data: any
  button: {
    label: string
    href: string
    external?: boolean
  }
  loading?: boolean
  className?: string
  isFarm?: boolean
};

export const TopAssets: React.FC<TopAssetsProps> = ({
  header,
  description,
  className,
  // loading = false,
  // isFarm = false,
  // data,
}) => (
  <Section
    header={header}
    description={description}
    className={className}
  >
    {/* {isFarm
      ? (<FarmTable loading={loading} disabled data={data} />)
      : (<PoolTable loading={loading} data={data} />)} */}
  </Section>
);
