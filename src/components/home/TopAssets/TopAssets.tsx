import React from 'react';

import { Section, SectionProps } from '@components/home/Section';
import { FarmTable } from '@components/common/FarmTable';

import { useTokens } from '@utils/dapp';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedFarm } from '@utils/types';
import { FarmCardTable } from '@components/common/FarmTable/FarmCardTable';

import { PoolTable } from '@components/common/PoolTable';
import { PoolCardTable } from '@components/common/PoolTable/PoolCardTable';
import s from './TopAssets.module.sass';

type TopAssetsProps = Omit<SectionProps, 'className'> & {
  // data: Omit<TopAssetsCardProps, 'className'>[]
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
      <div className={s.notMobile}>
        {isFarm
          ? (<FarmTable data={farms as WhitelistedFarm[]} />)
          : (<PoolTable data={farms as WhitelistedFarm[]} />)}
      </div>
      <div className={s.mobile}>
        {isFarm
          ? (<FarmCardTable data={farms as WhitelistedFarm[]} />)
          : (<PoolCardTable data={farms as WhitelistedFarm[]} />)}
      </div>
    </Section>
  );
};
