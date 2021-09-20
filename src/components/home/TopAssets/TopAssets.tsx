import React from 'react';

import { Section, SectionProps } from '@components/home/Section';
import { FarmTable } from '@components/tables/FarmTable';

import { PoolTable } from '@components/tables/PoolTable';

type TopAssetsProps = Omit<SectionProps, 'className'> & {
  data: any
  button: {
    label: string
    href: string
    external?: boolean
  }
  className?: string
  isFarm?: boolean
};

export const TopAssets: React.FC<TopAssetsProps> = ({
  header,
  description,
  className,
  isFarm = false,
  data,
}) => (
  <Section
    header={header}
    description={description}
    className={className}
  >
    {isFarm
      ? (<FarmTable disabled data={data} />)
      : (<PoolTable data={data} />)}
  </Section>
);
