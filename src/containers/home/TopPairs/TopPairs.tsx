import React from 'react';
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

  if (error || (!loading && !data) || data === undefined) {
    return <></>;
  }

  if (!data.pairs) return <></>;

  const pairData = data.pairs.edges.map((x) => ({
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
        label: 'Analytics',
        href: `https://analytics.quipuswap.com/pairs/${x?.node?.id}`,
        external: true,
      },
      second: {
        label: 'Trade',
        href: '/swap',
      },
    },
  }));

  return (
    <TopAssets
      header={t('home:Top Pairs')}
      description={t('home:The most popular Trading Pairs by trading volume')}
      data={pairData}
      button={{
        href: 'https://analytics.quipuswap.com/pairs',
        label: t('home:View All Pairs'),
        external: true,
      }}
      className={className}
    />
  );
};
