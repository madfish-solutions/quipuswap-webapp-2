import { DOLLAR, PERCENT } from '@config/constants';
import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

const list = [
  {
    itemUrl: '/',
    tokensInfo: [TEZOS_TOKEN, DEFAULT_TOKEN],
    tvlInUsd: 1000,
    newLiquidityLablesData: { visibleIcon: true, medalIcon: true, dollarIcon: true, caseIcon: true },
    isNewLiquidity: true,
    liquidityProvidersFee: 1
  },
  {
    itemUrl: '/',
    tokensInfo: [TEZOS_TOKEN, DEFAULT_TOKEN],
    tvlInUsd: 1000,
    newLiquidityLablesData: { visibleIcon: true, caseIcon: true, dollarIcon: true },
    isNewLiquidity: true,
    liquidityProvidersFee: 1
  },
  {
    itemUrl: '/',
    tokensInfo: [TEZOS_TOKEN, DEFAULT_TOKEN],
    tvlInUsd: 1000,
    isNewLiquidity: true,
    newLiquidityLablesData: { dollarIcon: true },
    liquidityProvidersFee: 1
  }
];

export const newLiquidityListDataHelper = () => {
  const listData = list?.map(
    ({ itemUrl, tokensInfo, tvlInUsd, newLiquidityLablesData, isNewLiquidity, liquidityProvidersFee }) => ({
      href: itemUrl,
      inputToken: tokensInfo,
      status: { status: ActiveStatus.ACTIVE, filled: true },
      isNewLiquidity,
      newLiquidityLablesData: newLiquidityLablesData,
      itemStats: [
        {
          cellName: i18n.t('newLiquidity|TVL'),
          tooltip: 'TVL tooltip',
          amounts: {
            amount: tvlInUsd,
            currency: DOLLAR,
            dollarEquivalent: tvlInUsd,
            dollarEquivalentOnly: true
          }
        },
        {
          cellName: i18n.t('newLiquidity|volume'),
          tooltip: 'Volume tooltip',
          amounts: {
            amount: tvlInUsd,
            currency: DOLLAR,
            dollarEquivalent: tvlInUsd,
            dollarEquivalentOnly: true
          }
        },
        {
          cellName: i18n.t('newLiquidity|APR'),
          tooltip: 'APR tooltip',
          amounts: {
            amount: tvlInUsd,
            currency: PERCENT,
            dollarEquivalent: tvlInUsd,
            dollarEquivalentOnly: true
          }
        },
        {
          cellName: i18n.t('newLiquidity|maxApr'),
          tooltip: 'Max APR tooltip',
          amounts: {
            amount: tvlInUsd,
            currency: PERCENT,
            dollarEquivalent: tvlInUsd,
            dollarEquivalentOnly: true
          }
        }
      ]
    })
  );

  return {
    list: listData
  };
};
