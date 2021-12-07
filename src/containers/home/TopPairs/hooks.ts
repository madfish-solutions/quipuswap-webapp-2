import { GetTokensPairsQuery, Token } from '@graphql';
import { prepareTokenName, transformNodeToWhitelistedToken } from '@utils/helpers';
import { useTranslation } from 'next-i18next';

export const usePairs = (data?: GetTokensPairsQuery) => {
  const { t } = useTranslation(['home']);
  return data?.pairs?.edges ? data?.pairs?.edges.map((x) => {
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
  }) : [];
};
