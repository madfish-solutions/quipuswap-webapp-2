import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { FarmTable } from '@madfish-solutions/quipu-ui-kit';

import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { Section } from '@components/home/Section';
import { useTokens } from '@utils/dapp';
import { WhitelistedFarm } from '@utils/types';

type TopFarmingsProps = {
  className?: string
};

export const TopFarmings: React.FC<TopFarmingsProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);
  const { data: tokens } = useTokens();
  const farms = useMemo(() => tokens.map((x) => (x.contractAddress === TEZOS_TOKEN.contractAddress
    ? { tokenPair: { token1: x, token2: STABLE_TOKEN } }
    : { tokenPair: { token1: x, token2: TEZOS_TOKEN } }))
    .filter((x, i) => i < 5), [tokens]);
  return (
    <Section
      header={t('home|Top Farms')}
      description={t('home|The most popular Farming pools by APR')}
      className={className}
    >
      <FarmTable loading={false} disabled data={farms as WhitelistedFarm[]} />
    </Section>
  );
};
