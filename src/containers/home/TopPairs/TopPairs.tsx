import React, { useMemo } from 'react';
import { useGetTokensPairsLazyQuery } from '@graphql';
import { useTranslation } from 'next-i18next';

import { Token } from 'graphql';
import { transformNodeToWhitelistedToken, prepareTokenName } from '@utils/helpers';
import { Section } from '@components/home/Section';
import { PoolTable } from '@components/tables/PoolTable';

type TopPairsProps = {
  className?: string
};

export const TopPairs: React.FC<TopPairsProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);
  const [fetchPairsData, { loading, data, error }] = useGetTokensPairsLazyQuery();

  const pairData = useMemo(() => data?.pairs?.edges.map((x) => {
    const t1 = (x && x.node && x.node.token1) as Token;
    const t2 = (x && x.node && x.node.token2) as Token;
    return ({
      token1: transformNodeToWhitelistedToken(t1),
      token2: transformNodeToWhitelistedToken(t2),
      xtzUsdQuote: data?.overview.xtzUsdQuote,
      pair: {
        name: `${prepareTokenName(t1)} / ${prepareTokenName(t2)}`,
        token1: x?.node?.token1,
        token2: x?.node?.token2,
      },
      data: {
        tvl: x?.node?.liquidity,
        volume24h: x?.node?.volume24h,
      },
      buttons: {
        first: {
          label: t('home|Analytics'),
          href: `https://analytics.quipuswap.com/pairs/${x?.node?.id}`,
          external: true,
        },
        second: {
          label: t('home|Trade'),
          href: `/swap/${x?.node?.token1.id}-${x?.node?.token2.id}`,
        },
      },
    });
  }), [data, t]);

  const isNotLoaded = error || (!loading && !data) || data === undefined || !data.pairs;

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
