import { useTranslation } from 'next-i18next';

import { GetTokensPairsQuery, Token } from '@graphql';
import { prepareTokenName, transformNodeToWhitelistedToken } from '@utils/helpers';

export const usePairs = (data?: GetTokensPairsQuery) => {
  const { t } = useTranslation(['home']);
  return (
    data?.pairs?.edges.map(x => {
      // TODO: Avoid type casting
      const token1 = x?.node?.token1 as Token;
      const token2 = x?.node?.token2 as Token;
      return {
        token1: transformNodeToWhitelistedToken(token1),
        token2: transformNodeToWhitelistedToken(token2),
        xtzUsdQuote: data?.overview.xtzUsdQuote,
        pair: {
          name: `${prepareTokenName(token1)} / ${prepareTokenName(token2)}`,
          token1,
          token2
        },
        data: {
          tvl: x?.node?.liquidity,
          volume24h: x?.node?.volume24h
        },
        buttons: {
          first: {
            label: t('home|Analytics'),
            href: `https://analytics.quipuswap.com/pairs/${x?.node?.id}`,
            external: true
          },
          second: {
            label: t('home|Trade'),
            href: `/swap/${x?.node?.token1.id}-${x?.node?.token2.id}`
          }
        }
      };
    }) ?? []
  );
};
