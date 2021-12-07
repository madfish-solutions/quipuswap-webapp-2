import React from 'react';
import { useTranslation } from 'next-i18next';
import { useGetTokensPairsLazyQuery } from '@graphql';

import { PoolTable } from '@components/tables/PoolTable';
import { Section } from '@components/home/Section';
import { usePairs } from '@containers/home/TopPairs/hooks';

interface TopPairsProps {
  className?: string;
}

export const TopPairs: React.FC<TopPairsProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);
  const [fetchPairsData, { loading, data, error }] = useGetTokensPairsLazyQuery();

  const isNotLoaded = error || (!loading && !data) || data === undefined || !data.pairs;

  const pairData = usePairs(data);

  return (
    <Section
      header={t('home|Top Pairs')}
      description={t('home|The most popular Trading Pairs by trading volume')}
      className={className}
    >
      <PoolTable
        fetch={fetchPairsData}
        loading={!!isNotLoaded}
        totalCount={data?.pairs?.totalCount ?? 0}
        data={isNotLoaded ? [] : pairData as any}
      />
    </Section>
  );
};
