import React from 'react';
// import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

// import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { Section } from '@components/home/Section';
// import { FarmTable } from '@components/tables/FarmTable';

type TopFarmingsProps = {
  className?: string
};

export const TopFarmings: React.FC<TopFarmingsProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);

  //   ? { tokenPair: { token1: x, token2: STABLE_TOKEN } }
  //   : { tokenPair: { token1: x, token2: TEZOS_TOKEN } })), [tokens]);
  return (
    <Section
      header={t('home:Top Farms')}
      description={t('home:The most popular Farming pools by APR')}
      className={className}
    >
      {/* <FarmTable loading={false} disabled data={farms} /> */}
    </Section>
  );
};
