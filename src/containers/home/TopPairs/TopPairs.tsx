import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useGetTokensPairsLazyQuery } from '@graphql';

import { Token } from 'graphql';
import { transformNodeToWhitelistedToken, prepareTokenName, getTokenSlug } from '@utils/helpers';
import { PoolTable } from '@components/tables/PoolTable';
import { Section } from '@components/home/Section';

type TopPairsProps = {
  className?: string
};

const getTokenId = (t1: Token) => ({
  contractAddress: t1.id!,
  fa2TokenId: t1.tokenId ? +(t1.tokenId) : undefined,
  type: t1.tokenId ? 'fa2' as const : 'fa1.2' as const,
});

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
          href: `/swap/${getTokenSlug(getTokenId(t1))}-${getTokenSlug(getTokenId(t2))}`,
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
