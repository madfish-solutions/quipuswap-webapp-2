import { DOLLAR, PERCENT } from '@config/constants';
import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { ActiveStatus } from '@shared/types';

const list = [
  {
    itemUrl: '/',
    tokensInfo: [TEZOS_TOKEN, DEFAULT_TOKEN],
    tvlInUsd: 1000,
    liquidityProvidersFee: 1
  },
  {
    itemUrl: '/',
    tokensInfo: [TEZOS_TOKEN, DEFAULT_TOKEN],
    tvlInUsd: 1000,
    liquidityProvidersFee: 1
  },
  {
    itemUrl: '/',
    tokensInfo: [TEZOS_TOKEN, DEFAULT_TOKEN],
    tvlInUsd: 1000,
    liquidityProvidersFee: 1
  }
];

export const newLiquidityListDataHelper = () => {
  const listData = list?.map(({ itemUrl, tokensInfo, tvlInUsd, liquidityProvidersFee }) => ({
    href: itemUrl,
    inputToken: tokensInfo,
    status: { status: ActiveStatus.ACTIVE, filled: true },
    itemStats: [
      {
        cellName: 'TVL',
        tooltip: '1',
        amounts: {
          amount: tvlInUsd,
          currency: DOLLAR,
          dollarEquivalent: tvlInUsd,
          dollarEquivalentOnly: true
        }
      },
      {
        cellName: 'Volume (7d)',
        tooltip: '2',
        amounts: {
          amount: tvlInUsd,
          currency: DOLLAR,
          dollarEquivalent: tvlInUsd,
          dollarEquivalentOnly: true
        }
      },
      {
        cellName: 'APR',
        tooltip: '3',
        amounts: {
          amount: tvlInUsd,
          currency: PERCENT,
          dollarEquivalent: tvlInUsd,
          dollarEquivalentOnly: true
        }
      },
      {
        cellName: 'Max APR',
        tooltip: '4',
        amounts: {
          amount: tvlInUsd,
          currency: PERCENT,
          dollarEquivalent: tvlInUsd,
          dollarEquivalentOnly: true
        }
      }
    ]
  }));

  return {
    list: listData
  };
};
