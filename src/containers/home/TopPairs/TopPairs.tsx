import React, { useMemo } from 'react';
import { useGetTokensPairsLazyQuery } from '@graphql';
import { useTranslation } from 'next-i18next';

import { Token } from 'graphql';
import { transformNodeToWhitelistedToken } from '@utils/helpers';
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

  const pairData = useMemo(() => data?.pairs?.edges.map((x) => ({
    token1: transformNodeToWhitelistedToken((x && x.node && x.node.token1) as Token),
    token2: transformNodeToWhitelistedToken((x && x.node && x.node.token2) as Token),
    xtzUsdQuote: data?.overview.xtzUsdQuote,
    pair: {
      name: `${x?.node?.token1.symbol} / ${x?.node?.token2.symbol}`,
      token1: x?.node?.token1,
      token2: x?.node?.token2,
    },
    data: {
      tvl: x?.node?.liquidity,
      volume24h: x?.node?.volume24h,
    },
    buttons: {
      first: {
        label: t('home:Analytics'),
        href: `https://analytics.quipuswap.com/pairs/${x?.node?.id}`,
        external: true,
      },
      second: {
        label: t('home:Trade'),
        href: `/swap/${x?.node?.token1.id}-${x?.node?.token2.id}`,
      },
    },
  })), [data]);

  const isNotLoaded = error || (!loading && !data) || data === undefined || !data.pairs;

  return (
    <Section
      header={t('home:Top Pairs')}
      description={t('home:The most popular Trading Pairs by trading volume')}
      className={className}
    >
      <PoolTable
        fetch={fetchPairsData}
        loading={!!isNotLoaded}
        totalCount={data?.pairs?.totalCount ?? 0}
        data={isNotLoaded ? [] : pairData as any}
        // data={isNotLoaded ? [] : pairData?.
        //   filter(x => pairData
        //     .filter(y => x.pair.name === y.pair.name).length < 2) as any}
      />
    </Section>
  );
};
