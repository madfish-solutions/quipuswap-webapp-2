import React, { useMemo } from 'react';
import { useGetTokensPairsQuery } from '@graphql';
import { useTranslation } from 'next-i18next';

import { TopAssets } from '@components/home/TopAssets';

type TopPairsProps = {
  className?: string
};

export const TopPairs: React.FC<TopPairsProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);
  const { loading, data, error } = useGetTokensPairsQuery();

  const pairData = useMemo(() => data?.pairs?.edges.map((x) => ({
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
    <TopAssets
      header={t('home:Top Pairs')}
      description={t('home:The most popular Trading Pairs by trading volume')}
      data={isNotLoaded ? [] : pairData}
      button={{
        href: 'https://analytics.quipuswap.com/pairs',
        label: t('home:View All Pairs'),
        external: true,
      }}
      loading={!!isNotLoaded}
      className={className}
    />
  );
};
