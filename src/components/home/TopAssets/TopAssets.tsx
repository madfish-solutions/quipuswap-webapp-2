import React from 'react';

import { Section, SectionProps } from '@components/home/Section';
import { FarmTable } from '@components/tables/FarmTable';

import { useTokens } from '@utils/dapp';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedFarm } from '@utils/types';

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
}) => {
  const { data: tokens } = useTokens();
  const farms = tokens.map((x) => (x.contractAddress === TEZOS_TOKEN.contractAddress
    ? { tokenPair: { token1: x, token2: STABLE_TOKEN } }
    : { tokenPair: { token1: x, token2: TEZOS_TOKEN } }));
  return (
    <Section
      header={header}
      description={description}
      className={className}
    >
      {isFarm
        ? (<FarmTable disabled data={farms as WhitelistedFarm[]} />)
        : (<PoolTable data={farms as WhitelistedFarm[]} />)}
    </Section>
  );
};
