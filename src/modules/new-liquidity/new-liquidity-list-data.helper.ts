import { DOLLAR, PERCENT } from '@config/constants';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

const list = [
  {
    itemUrl: '/',
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    tvlInUsd: 1000,
    visibleIcon: true,
    newLiquidityLablesData: { MEDAL: true, DOLLAR: true, CASE: true },
    isNewLiquidity: true,
    liquidityProvidersFee: 1
  },
  {
    itemUrl: '/',
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    tvlInUsd: 1000,
    newLiquidityLablesData: { CASE: true, DOLLAR: true },
    isNewLiquidity: true,
    liquidityProvidersFee: 1
  },
  {
    itemUrl: '/',
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    tvlInUsd: 1000,
    isNewLiquidity: true,
    visibleIcon: true,
    newLiquidityLablesData: { DOLLAR: true },
    liquidityProvidersFee: 1
  }
];

export const newLiquidityListDataHelper = () => {
  const listData = list?.map(
    ({ itemUrl, tokensInfo, tvlInUsd, newLiquidityLablesData, isNewLiquidity, visibleIcon }) => ({
      href: itemUrl,
      inputToken: tokensInfo,
      status: { status: ActiveStatus.ACTIVE, filled: true },
      isNewLiquidity,
      visibleIcon,
      newLiquidityLablesData,
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
            currency: PERCENT
          }
        },
        {
          cellName: i18n.t('newLiquidity|maxApr'),
          tooltip: 'Max APR tooltip',
          amounts: {
            amount: tvlInUsd,
            currency: PERCENT
          }
        }
      ]
    })
  );

  return {
    list: listData
  };
};
